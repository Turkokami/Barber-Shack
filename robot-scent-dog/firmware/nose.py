"""Hardware layer for the Robo-K9 e-nose (Raspberry Pi 5).

Wiring follows SCHEMATICS.md section 3. Everything the rest of the code needs is here:
    nose = Nose(); nose.set_path("clean"|"sample"); nose.set_pump(0..1); nose.read()
Run `python nose.py` for a quick self-test that prints one reading per second.
"""

import time

import board
import busio
import adafruit_tca9548a
import adafruit_bme680
import adafruit_sht4x
from adafruit_bus_device.i2c_device import I2CDevice
from adafruit_ads1x15 import ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
from gpiozero import PWMOutputDevice, OutputDevice, LED, Button

# --- Pin map (BCM numbering) -------------------------------------------------
PIN_PUMP = 18      # Q1, PWM
PIN_VALVE = 23     # Q2, 3-way valve: off = clean air, on = sample
PIN_HEATER = 24    # Q3, Tenax heater (Phase 3)
PIN_BUZZER = 25    # Q4
PIN_BUTTON = 5     # wand trigger, to GND
PIN_LED = 16

# --- I2C mux channels ----------------------------------------------------------
MUX_BME_A, MUX_BME_B, MUX_SGP41, MUX_SHT45, MUX_ADS = 0, 1, 2, 3, 4

# BME688 heater setpoints: two different temperatures give two "views" of the same air.
BME_A_HEATER_C, BME_B_HEATER_C = 320, 220
BME_HEATER_MS = 150

# Figaro sensing circuit (SCHEMATICS 3c)
FIGARO_VC = 3.3
FIGARO_RL = 10_000.0

SGP41_ADDR = 0x59


def _crc8(data: bytes) -> int:
    """Sensirion CRC-8 (poly 0x31, init 0xFF)."""
    crc = 0xFF
    for byte in data:
        crc ^= byte
        for _ in range(8):
            crc = ((crc << 1) ^ 0x31) & 0xFF if crc & 0x80 else (crc << 1) & 0xFF
    return crc


def _word(value: int) -> bytes:
    raw = bytes([(value >> 8) & 0xFF, value & 0xFF])
    return raw + bytes([_crc8(raw)])


class SGP41:
    """Minimal raw-signal driver (datasheet commands 0x2612 conditioning, 0x2619 measure)."""

    def __init__(self, bus):
        self.dev = I2CDevice(bus, SGP41_ADDR)

    def _cmd(self, cmd: int, rh: float, t: float, n_words: int) -> list:
        rh_ticks = int(max(0.0, min(100.0, rh)) * 65535 / 100)
        t_ticks = int((max(-45.0, min(130.0, t)) + 45) * 65535 / 175)
        buf = bytes([cmd >> 8, cmd & 0xFF]) + _word(rh_ticks) + _word(t_ticks)
        with self.dev as d:
            d.write(buf)
        time.sleep(0.05)
        out = bytearray(3 * n_words)
        with self.dev as d:
            d.readinto(out)
        words = []
        for i in range(n_words):
            chunk = out[3 * i:3 * i + 3]
            if _crc8(chunk[:2]) != chunk[2]:
                raise IOError("SGP41 CRC mismatch")
            words.append((chunk[0] << 8) | chunk[1])
        return words

    def condition(self, rh=50.0, t=25.0, seconds=10):
        """Required after power-up: at most 10 s of conditioning, once per second."""
        for _ in range(seconds):
            self._cmd(0x2612, rh, t, 1)
            time.sleep(0.95)

    def measure_raw(self, rh=50.0, t=25.0):
        voc, nox = self._cmd(0x2619, rh, t, 2)
        return voc, nox


class Nose:
    def __init__(self):
        i2c = busio.I2C(board.SCL, board.SDA, frequency=100_000)
        self.mux = adafruit_tca9548a.TCA9548A(i2c)

        self.bme_a = adafruit_bme680.Adafruit_BME680_I2C(self.mux[MUX_BME_A], address=0x77)
        self.bme_b = adafruit_bme680.Adafruit_BME680_I2C(self.mux[MUX_BME_B], address=0x77)
        for bme, temp in ((self.bme_a, BME_A_HEATER_C), (self.bme_b, BME_B_HEATER_C)):
            if hasattr(bme, "set_gas_heater"):  # newer library versions
                bme.set_gas_heater(temp, BME_HEATER_MS)

        self.sht = adafruit_sht4x.SHT4x(self.mux[MUX_SHT45])
        self.sgp = SGP41(self.mux[MUX_SGP41])

        ads = ADS.ADS1115(self.mux[MUX_ADS])
        ads.gain = 1  # +/-4.096 V
        pins = [getattr(ADS, f"P{i}", i) for i in range(4)]
        self.ain = [AnalogIn(ads, p) for p in pins]

        self.pump = PWMOutputDevice(PIN_PUMP, frequency=1000)
        self.valve = OutputDevice(PIN_VALVE)
        self.heater = PWMOutputDevice(PIN_HEATER, frequency=50)
        self.buzzer = OutputDevice(PIN_BUZZER)
        self.led = LED(PIN_LED)
        self.button = Button(PIN_BUTTON, pull_up=True)

        self.safe()

    # --- actuators -------------------------------------------------------------
    def safe(self):
        self.pump.value = 0
        self.valve.off()
        self.heater.value = 0
        self.buzzer.off()
        self.led.off()

    def set_path(self, path: str):
        self.valve.on() if path == "sample" else self.valve.off()

    def set_pump(self, duty: float):
        self.pump.value = max(0.0, min(1.0, duty))

    def beep(self, seconds=0.3):
        self.buzzer.on()
        time.sleep(seconds)
        self.buzzer.off()

    # --- sensors ---------------------------------------------------------------
    @staticmethod
    def _figaro_rs(vout: float) -> float:
        vout = max(vout, 1e-3)
        return FIGARO_RL * (FIGARO_VC - vout) / vout

    def condition(self):
        t, rh = self.sht.measurements
        self.sgp.condition(rh, t)

    def read(self) -> dict:
        t, rh = self.sht.measurements
        voc_raw, nox_raw = self.sgp.measure_raw(rh, t)
        v = [ch.voltage for ch in self.ain]
        return {
            "chamber_t": round(t, 3),
            "chamber_rh": round(rh, 3),
            "pressure_hpa": round(self.bme_a.pressure, 2),
            "bme_a_gas": self.bme_a.gas,
            "bme_b_gas": self.bme_b.gas,
            "sgp_voc_raw": voc_raw,
            "sgp_nox_raw": nox_raw,
            "tgs2602_rs": round(self._figaro_rs(v[0]), 1),
            "tgs2620_rs": round(self._figaro_rs(v[1]), 1),
            "pid_v": round(v[2], 5),
            "tenax_ntc_v": round(v[3], 4),
        }


if __name__ == "__main__":
    nose = Nose()
    print("Conditioning SGP41 (10 s)...")
    nose.condition()
    nose.set_pump(1.0)
    try:
        while True:
            print(nose.read())
            time.sleep(1)
    finally:
        nose.safe()
