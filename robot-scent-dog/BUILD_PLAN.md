# Robo-K9 Build Plan: Bed Bug Scent-Detection Robot Dog

> Prices are approximate as of September 2026 and are there for budgeting. Check each link at
> checkout. Where a part is sold by many vendors, the link goes to a vendor I found carrying it.

---

## 1. Research summary: what we're detecting and what the tech can do

### 1.1 The bed bug chemical signature

| Compound | Where it comes from | Why it matters | Sensor that sees it best |
|---|---|---|---|
| **(E)-2-hexenal** | Alarm pheromone (~70%), dorsal abdominal glands of nymphs | Strongest, best-studied marker | MOS (BME688, TGS2620, SGP41), PID |
| **(E)-2-octenal** | Alarm pheromone (~30%) | Paired with hexenal; the ratio helps tell it apart from plant smells | MOS, PID |
| 4-oxo-(E)-2-hexenal, 4-oxo-(E)-2-octenal | Freshly shed nymph skins (exuviae) | Marker for an active, growing colony | MOS, PID |
| **Dimethyl disulfide / dimethyl trisulfide** | Aggregation pheromone (feces and harborages) | Sulfur compounds; MOS sensors respond to them very strongly | TGS2602, BME688 |
| 2-hexanone | Aggregation pheromone | Extra dimension for the classifier | MOS, PID |
| Histamine | Feces, harborages (not volatile) | Not detectable by air; visual/swab only | (camera: fecal spots) |

Sources: [Volatile Organic Compounds: A Promising Tool for Bed Bug Detection (IJERPH 2023, review)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10048870/),
[Heat exposure causes alarm-pheromone emission (Sci. Reports 2024)](https://www.nature.com/articles/s41598-024-57925-y),
[Oscillator-based trans-2-hexenal sensor array for bed bugs (Sensors & Actuators B)](https://www.sciencedirect.com/science/article/abs/pii/S0925400520315008),
[OSU bed bug detection research references](https://u.osu.edu/bedbugs/research-refs/bed-bug-detection/),
[US Patent 10,271,534, Selective detection of bed bug pheromones](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10271534).
Aggregation pheromone composition: Gries et al., *Angewandte Chemie* 2015, "Bed bug aggregation pheromone finally identified".

### 1.2 Hard truths that shape the design

1. **Concentrations are tiny.** A few hidden bugs give off parts-per-trillion to low parts-per-billion
   levels in room air. A dog's nose works there; a cheap MOS sensor is at its limit. Design responses:
   - **Sniff close.** Put the intake 2 to 10 cm from the surface (the "snout").
   - **Pump and seal.** Pull the sample into a small sealed chamber instead of waiting for it to drift to the sensors.
   - **Measure change, not level.** Purge with carbon-filtered air, then sniff. The classifier reads the *change* from the clean baseline.
   - **Optional preconcentrator** (Phase 3): trap VOCs on Tenax TA for 30 to 60 s, then flash-heat to release them all at once. That gives roughly 10x to 100x more signal. [Improving e-noses with a trap + thermal desorption unit](https://www.sciencedirect.com/science/article/abs/pii/S0925400500004937)
   - **Optional PID** (ION Science MiniPID 2 PPB) as a high-sensitivity channel.
2. **(E)-2-hexenal is also a "green leaf volatile."** Cut grass, fruit, olive oil, cooking and some
   cleaners give it off. Stink bugs make the same aldehydes. **Negative training data matters as much as positive data.**
   The sensor *array* and the hexenal-to-octenal *ratio*, plus the sulfur (DMDS/DMTS) channel,
   are what give you selectivity.
3. **Real dogs aren't perfect either.** In a controlled study, dogs found live bugs and eggs with 97.5% accuracy
   ([Pfiester et al. 2008](https://pubmed.ncbi.nlm.nih.gov/18767752/)). In real apartments, accuracy
   dropped a lot: about 44% detection with about 15% false positives
   ([Cooper et al. 2014, Rutgers](https://entomology.rutgers.edu/personnel/changlu-wang/docs/Cooper2014AccuracyCanines.pdf)).
   That gives us a realistic benchmark to beat and a tested protocol to copy.
4. **A quadruped can't put its nose into mattress seams.** So the robot sweeps the floor-level
   zones (bed legs, box-spring base, baseboards, couch base, luggage), and a detachable **sniff wand**
   on a 1.5 m tube lets a handler check seams and headboards with the same nose.

### 1.3 Technology options considered

| Subsystem | Options | Pick | Why |
|---|---|---|---|
| Gas sensing | MOS (BME688, SGP41, Figaro TGS), PID, QCM/resonant, electrochemical, GC-MS | **MOS array + optional PID** | MOS is cheap, fast, and each sensor type sees different compounds, so an ML model can combine them. PID adds sensitivity. GC-MS is ground truth but lab-only. |
| AI on the gas data | Bosch BME AI-Studio, Edge Impulse, scikit-learn on Pi | **All three:** AI-Studio to design heater profiles, scikit-learn/Edge Impulse for the model | Free, well-documented ([BME688 software](https://www.bosch-sensortec.com/en/software-tools/software/bme688-and-bme690-software), [Edge Impulse Nicla Sense ME](https://docs.edgeimpulse.com/hardware/boards/arduino-nicla-sense-me)) |
| Brain | Raspberry Pi 5, Jetson Orin Nano, ESP32 | **Raspberry Pi 5 (8 GB) + AI HAT+ (26 TOPS)** | Cheap, great Python/sensor libraries, runs ROS 2, and the Hailo chip runs YOLO for the visual check |
| Robot body | Petoi Bittle X, Waveshare WAVEGO Pro, Unitree Go2 Air/Pro, Go2 EDU, Boston Dynamics Spot | **Unitree Go2 Pro** (recommended), **Go2 EDU** if budget allows | Go2 has built-in 4D LiDAR, a real payload, and ROS 2 support (official on EDU, [community go2_ros2_sdk](https://github.com/abizovnuralem/go2_ros2_sdk) on Air/Pro). Bittle/WAVEGO are fine for demos but can't carry the nose plus a battery reliably. Spot costs more than ten times as much. |
| Visual check | Pi Camera Module 3, thermal (MLX90640) | **Camera Module 3 + YOLO on Hailo** | Can spot live bugs, shed skins and fecal spotting close up. Thermal at 32x24 pixels is too coarse for bugs, so it's left out. |
| Navigation | Go2's built-in LiDAR, add-on RPLIDAR C1 | **Built-in Go2 LiDAR** + slam_toolbox + Nav2 | Already on the robot. [RPLIDAR C1](https://www.robotshop.com/products/slamtec-rplidar-c1-360-dtof-laser-scanner) only if you use a budget body. |

---

## 2. System architecture

```
 ┌──────────────── ROBOT (Unitree Go2) ────────────────┐
 │  LiDAR ─► SLAM / Nav2 ─► waypoint "sniff stations"  │
 │  Sport-mode API: walk, stop, lower body, SIT (alert)│
 └───────────────▲─────────────────────────────────────┘
                 │ Wi-Fi WebRTC (Air/Pro) or Ethernet DDS (EDU)
 ┌───────────────┴──────── NOSE PAYLOAD (back mount) ───────────────┐
 │ Raspberry Pi 5 + AI HAT+                                         │
 │  ├─ sniff_logger.py : valve/pump sniff cycle, reads sensor array │
 │  ├─ detector.py     : ML model → P(bed bug) per sniff            │
 │  ├─ YOLO (Hailo)    : camera check at positive stations          │
 │  └─ ROS 2 bridge    : /nose/detection → robot sits + map pin     │
 │ Snout intake ─► filter ─► 3-way valve ─► sensor chamber ─► pump  │
 │ Clean-air leg: carbon filter ─┘                                  │
 └──────────────────────────────────────────────────────────────────┘
        ▲ quick-disconnect
 ┌──────┴───────┐
 │ Sniff wand   │  1.5 m PTFE tube + handle; handler probes mattress seams
 └──────────────┘
```

Detailed drawings are in [SCHEMATICS.md](SCHEMATICS.md).

### Detection behaviour (copies a detection dog's search)
1. **Map:** tele-op the robot once around the room (slam_toolbox) and save the map.
2. **Plan:** auto-generate "sniff stations" every 30 to 50 cm along the bed perimeter, baseboards,
   furniture bases, and around luggage.
3. **At each station:** stop, pitch the body nose-down (Go2 `Euler`/`BodyHeight` commands), then run
   3 sniff cycles (purge 20 s, sniff 5 s, measure 10 s).
4. **Score:** the classifier outputs P(bed bug). Filter it over consecutive sniffs and neighbouring stations.
5. **Alert:** if P > threshold at 2 or more consecutive sniffs, the robot **sits**, beeps, grabs a camera
   frame for YOLO, and drops a red pin on the map. Otherwise it moves to the next station.
6. **Report:** a heat-map PNG of P(bed bug) over the room map, plus the CSV log.

---

## 3. Phased execution plan

| Phase | Weeks | Goal | Spend | Gate to pass |
|---|---|---|---|---|
| 0: Bench nose | 1–4 | Build the e-nose, collect data, train v1 model | ~$600–800 | **GO/NO-GO:** blinded test with ≥ 85% sensitivity and ≤ 10% false positives at 5 cm, training aid vs. blanks and confounders |
| 1: Sniff wand | 5–7 | Make it portable (battery, handle, 1.5 m wand), test in a real room | ~$150 | ≥ 80% / ≤ 15% in a mock room with hidden vials |
| 2: Robot integration | 8–13 | Mount the nose on the Go2, set up ROS 2 bridge, stations, SIT alert | Robot + ~$250 | Robot finishes an autonomous room search and alerts on hidden aids |
| 3: Sensitivity upgrades | 14–18 | Tenax preconcentrator, MiniPID, heater-profile tuning, visual YOLO check | ~$300–1,500 | Detects a **single live-bug vial** at 30 cm; beats the Cooper 2014 field benchmark |
| 4: Field pilot | 19–24 | Pest-control partner homes, compare against human and dog inspections | Labor | Published accuracy numbers; decide on a product path |

### Phase 0: Bench e-nose (weeks 1–4)

**Build**
1. Flash Raspberry Pi OS (64-bit, Bookworm or newer) and enable I2C (`sudo raspi-config` → Interface → I2C).
2. Wire everything following [SCHEMATICS.md §3](SCHEMATICS.md#3-electrical-schematic). Start with the mux and the BME688 pair,
   check them with `i2cdetect -y 1`, then add one sensor at a time.
3. Build the sensor chamber (SCHEMATICS §5). Use aluminium, glass or PTFE. **Don't use PLA or PETG
   for anything the sample air touches**: printed plastics absorb and release VOCs, which smears
   the signal and carries smells over from one sniff to the next.
4. Plumb the pneumatics (SCHEMATICS §2). Put the pump **after** the chamber so the pump's own smells
   never reach the sensors.
5. `pip install -r firmware/requirements.txt`, then run `python firmware/sniff_logger.py --label blank --station test`.
6. **Burn-in:** run the system for 48 hours before you trust any data. New MOS sensors drift a lot at first.
   Also run the SGP41 conditioning step (the logger does this at startup).

**Tune heater profiles (BME688)**
- The [BME688 Development Kit](https://www.sparkfun.com/bosch-bme688-development-kit.html) (8 sensors)
  with **BME AI-Studio** can test many heater-temperature profiles at the same time. Record positive
  and negative samples, let AI-Studio rank the profiles, then run the best two on your two BME688s.
  This is optional but saves weeks of guessing.

**Collect data** (with the target presented 5 cm from the snout inlet)
| Class | Source | Sessions |
|---|---|---|
| `bedbug_live` | Live-bug training vials | 40+ |
| `bedbug_pseudo` | Pheromone pseudo-scent, or a lab mix of (E)-2-hexenal:(E)-2-octenal 70:30 at 1 ppm, 100 ppb and 10 ppb | 40+ |
| `blank` | Clean vial / room air | 60+ |
| `confounder_*` | Cut grass, apple, olive oil, cooking oil, cleaners, perfume, dirty laundry, dog, human sweat, stink bug (if available), cockroach aid | 10+ each |

**Train:** `python firmware/train_classifier.py data/*.csv`. It does grouped cross-validation (by session,
so the model can't cheat by memorising one session) and saves `model.joblib`.

**Gate test:** someone else sets up 20 blinded trials (10 positive, 10 negative/confounder) in
random order. Log the results. **If you miss the gate**, try in this order: move closer, lengthen the
sniff, add more negative data, add the MiniPID, add the preconcentrator.

### Phase 1: Sniff wand (weeks 5–7)
- Put the Pi + nose in a small enclosure with a 12 V battery (SCHEMATICS §4).
- Add a 1.5 m PTFE tube wand with a quick-disconnect at the snout port and a push button on the handle (GPIO 5).
- Mock room: hide vials in a bed frame, a couch and luggage. Run 30 blinded searches.
- This version can already be sold as a pest-control inspection aid.

### Phase 2: Robot integration (weeks 8–13)
1. **Set up the robot.** Go2 Pro: install [go2_ros2_sdk](https://github.com/abizovnuralem/go2_ros2_sdk)
   (ROS 2 over WebRTC on Wi-Fi). Go2 EDU: use the official [unitree_sdk2](https://github.com/unitreerobotics/unitree_sdk2) /
   [unitree_sdk2_python](https://github.com/unitreerobotics/unitree_sdk2_python) over Ethernet DDS
   ([Go2 SDK guide](https://support.unitree.com/home/en/developer)).
2. **Mount.** Bolt a 3 mm aluminium plate to the Go2's top rails. Nose box on the plate. Snout boom runs
   forward and down the chest line, intake about 8 cm above the floor at normal stance and 2 to 3 cm when the body pitches down.
   Keep the total payload under 3 kg for runtime.
3. **ROS 2 bridge node** (Pi 5): publish `/nose/p_bedbug` (Float32) and `/nose/alert` (Bool). A mission node
   subscribes and sends Nav2 goals to each station. On an alert it calls the sport-mode "Sit" (Pro/EDU) and
   plays a sound.
4. **Station generator:** load the saved map, take the occupied-cell edges (walls, furniture), offset them
   35 cm, and resample every 40 cm into a list of waypoints.
5. **Test:** 10 runs in the mock room with hidden aids at random locations. Measure detection, false alerts and search time.

### Phase 3: Sensitivity upgrades (weeks 14–18)
- **Tenax TA preconcentrator** (SCHEMATICS §2b): a stainless tube packed with Tenax TA, wrapped in a
  polyimide heater with a thermistor. Adsorb for 60 s at 200 mL/min, then heat to about 180 °C in about 5 s
  and push the released burst into the chamber with a small flow. Sorbent: [Sigma-Aldrich Tenax TA tubes](https://www.sigmaaldrich.com/US/en/product/supelco/29741u)
  (repack one or cut to length) or [SKC Tenax tubes](https://www.skcltd.com/products2/sorbent-tubes/tenax-sorbent-tubes.html).
- **MiniPID 2 PPB** on ADS1115 channel A2 ([ION Science](https://www.ionscience.com/products/minipid-2-pid-ppb/), request a quote).
- **Visual check:** fine-tune YOLOv8n on your own close-up photos (live bugs, shed skins, fecal spots,
  eggs, and negatives such as lint, seeds and ink dots). Compile for the Hailo-8 with the Hailo Dataflow
  Compiler. Run it only at positive stations to save power.

### Phase 4: Field pilot (weeks 19–24)
- Partner with a licensed pest-control operator. Run the robot **alongside** their normal inspection
  (visual and/or dog). Confirm every result with a visual find or monitors (for example interceptor cups over 2 weeks).
- Report sensitivity, specificity, time per room, and the cases where it failed.

---

## 4. Bill of materials with purchase links

Machine-readable version: [BOM.csv](BOM.csv).

### 4.1 Nose: sensing (Phase 0)

| # | Part | Qty | ~Unit $ | Buy |
|---|---|---|---|---|
| 1 | Adafruit BME688 (T/RH/P/gas, AI heater profiles), STEMMA QT | 2 | 20 | [Adafruit 5046](https://www.adafruit.com/product/5046) |
| 2 | Adafruit SGP41 VOC + NOx MOX sensor, STEMMA QT | 1 | 20 | [Adafruit 6455](https://www.adafruit.com/product/6455) |
| 3 | Figaro TGS2602 (sulfur compounds, VOC, odor: DMDS/DMTS channel) | 1 | 15 | [Figaro TGS2602](https://www.figarosensor.com/product/entry/tgs2602.html) · [Octopart distributors](https://octopart.com/tgs2602-figaro-103246580) |
| 4 | Figaro TGS2620 (alcohols and organic solvents: aldehyde channel) | 1 | 15 | [Octopart TGS2620](https://octopart.com/search?q=TGS2620) |
| 5 | Adafruit SHT45 chamber T/RH reference, STEMMA QT | 1 | 13 | [Adafruit 5665](https://www.adafruit.com/product/5665) |
| 6 | Adafruit ADS1115 16-bit ADC (reads the Figaro and PID outputs) | 1 | 15 | [Adafruit 1085](https://www.adafruit.com/product/1085) |
| 7 | TCA9548A 8-channel I2C mux, STEMMA QT/Qwiic | 1 | 12 | [Adafruit 4704](https://www.adafruit.com/product/4704) |
| 8 | STEMMA QT / Qwiic cables, 100 mm, assorted | 6 | 1 | [Adafruit 4210](https://www.adafruit.com/product/4210) |
| 9 | *(Optional, speeds up Phase 0)* Bosch BME688 Development Kit, 8 sensors | 1 | 87 | [SparkFun](https://www.sparkfun.com/bosch-bme688-development-kit.html) · [DigiKey](https://www.digikey.com/en/products/detail/bosch-sensortec/EVALUATION-KIT-BOARD-BME688/14617513) |
| 10 | *(Optional, Phase 3)* ION Science MiniPID 2 PPB | 1 | quote | [ION Science](https://www.ionscience.com/products/minipid-2-pid-ppb/) |

### 4.2 Nose: airflow (pneumatics)

| # | Part | Qty | ~Unit $ | Buy |
|---|---|---|---|---|
| 11 | Air pump / vacuum DC motor, 4.5–5 V, 2.5 LPM | 2 (1 spare) | 8 | [Adafruit 4699](https://www.adafruit.com/product/4699) |
| 12 | 3-way mini solenoid air valve, 12 V, 2-position (NO/NC), 1/8" barbs | 1 | 12–18 | Search: ["12V 3 way mini solenoid valve air"](https://www.amazon.com/s?k=12V+3+way+mini+solenoid+valve+air) |
| 13 | PTFE tubing 1/8" ID × 1/4" OD, 3 m (sample path, inert) | 1 | 20 | [McMaster-Carr PTFE tubing](https://www.mcmaster.com/ptfe-tubing/) |
| 14 | Silicone tubing 1/8" ID (pump side and exhaust only) | 1 | 8 | [McMaster-Carr silicone tubing](https://www.mcmaster.com/silicone-tubing/) |
| 15 | Inline activated-carbon filter (clean-air purge leg) | 2 | 8 | Search: ["inline activated carbon air filter 1/8 barb"](https://www.amazon.com/s?k=inline+activated+carbon+air+filter+barb) |
| 16 | PTFE membrane particulate filter, 1 µm, barbed (inlet dust guard) | 3 | 5 | Search: ["PTFE inline filter 1 micron barb"](https://www.amazon.com/s?k=PTFE+inline+filter+1+micron+barb) |
| 17 | Sensor chamber: 6061 aluminium block 60×40×20 mm (machine it, or use a small aluminium project box) + PTFE gasket | 1 | 15 | [McMaster aluminium bar](https://www.mcmaster.com/aluminum/) · [McMaster PTFE sheet](https://www.mcmaster.com/ptfe-sheets/) |
| 18 | Polypropylene barbed fittings/tees, 1/8" | 1 pk | 10 | [McMaster barbed fittings](https://www.mcmaster.com/barbed-tube-fittings/) |
| 19 | Quick-disconnect coupling 1/8" (wand port) | 1 | 8 | [McMaster quick-disconnects](https://www.mcmaster.com/quick-disconnect-tube-couplings/) |
| 20 | Stainless tube, 1/4" OD × 150 mm (rigid snout) | 1 | 10 | [McMaster stainless tubing](https://www.mcmaster.com/stainless-steel-tubing/) |

### 4.3 Compute, power, control

| # | Part | Qty | ~Unit $ | Buy |
|---|---|---|---|---|
| 21 | Raspberry Pi 5, 8 GB | 1 | 80 | [raspberrypi.com](https://www.raspberrypi.com/products/raspberry-pi-5/) |
| 22 | Raspberry Pi 27 W USB-C PSU (bench only) | 1 | 12 | [raspberrypi.com](https://www.raspberrypi.com/products/27w-power-supply/) |
| 23 | Raspberry Pi Active Cooler | 1 | 5 | [raspberrypi.com](https://www.raspberrypi.com/products/active-cooler/) |
| 24 | microSD 64 GB A2 (or an NVMe HAT + SSD) | 1 | 12 | [Raspberry Pi SD card](https://www.raspberrypi.com/products/sd-cards/) |
| 25 | Raspberry Pi AI HAT+ 26 TOPS (Hailo-8), Phase 2–3 | 1 | 110 | [raspberrypi.com](https://www.raspberrypi.com/products/ai-hat/) |
| 26 | Raspberry Pi Camera Module 3 (autofocus, close focus) | 1 | 25 | [raspberrypi.com](https://www.raspberrypi.com/products/camera-module-3/) |
| 27 | Pololu D36V50F5 5 V 5.5 A buck regulator (12 V → 5 V rail) | 1 | 25 | [Pololu 4091](https://www.pololu.com/product/4091) |
| 28 | IRLB8721 logic-level N-MOSFET (pump, valve, heater drivers) | 4 | 2 | [Adafruit 355](https://www.adafruit.com/product/355) |
| 29 | 1N5819 Schottky diodes (flyback), 10 kΩ and 100 Ω resistors, 10 kΩ load resistors for the Figaro sensors (1 %) | kit | 10 | [Tayda 1N5819](https://www.taydaelectronics.com/1n5819-schottky-barrier-diode-1a-40v.html) · resistor kit, any |
| 30 | 12 V 6 Ah+ Li-ion pack with DC output (Phase 1+), e.g. TalentCell 12 V | 1 | 40 | Search: ["TalentCell 12V lithium battery"](https://www.amazon.com/s?k=TalentCell+12V+lithium+battery) |
| 31 | Inline fuse holder + 5 A blade fuse | 1 | 5 | any auto parts / Amazon |
| 32 | Piezo buzzer (active, 5 V) + 5 mm LED | 1 | 2 | [Adafruit 1536](https://www.adafruit.com/product/1536) |
| 33 | Momentary push button (wand trigger) | 1 | 1 | [Adafruit 1009](https://www.adafruit.com/product/1009) |
| 34 | Perma-Proto HAT (solder the MOSFET drivers onto it) | 1 | 10 | [Adafruit 2310](https://www.adafruit.com/product/2310) |
| 35 | Enclosure, aluminium or ABS, ~200×120×75 mm, vented | 1 | 25 | Search: ["aluminum project enclosure 200x120"](https://www.amazon.com/s?k=aluminum+project+enclosure+200x120) |

### 4.4 Robot body (choose one tier)

| Tier | Platform | ~$ | Buy | Notes |
|---|---|---|---|---|
| Demo / mascot | Petoi Bittle X | 300 | [Petoi](https://www.petoi.com/products/petoi-robot-dog-bittle-x-voice-controlled) | Too small to carry the nose. Use it for demos with a wand. |
| Budget | Waveshare WAVEGO Pro (Pi 5 host) | ~300–400 | [CNX writeup / links](https://www.cnx-software.com/2025/08/13/wavego-pro-12-dof-bionic-robot-dog-supports-esp-now-and-ai-vision-through-raspberry-pi-4-5-sbc/) | Light payload. Needs an external lighter nose (drop the Figaro sensors) and an RPLIDAR C1 for mapping. |
| **Recommended** | **Unitree Go2 Pro** | ~2,800 | [Pricing overview](https://blog.robozaps.com/b/unitree-go2-review) · [Robostore](https://robostore.com/products/go2-edu-40-tops-computing-quadruped-robot-dog) | Built-in 4D LiDAR, strong payload. ROS 2 via [go2_ros2_sdk](https://github.com/abizovnuralem/go2_ros2_sdk) (WebRTC). |
| Pro / research | Unitree Go2 EDU | 11,190–15,600 | [Robostore Go2 EDU](https://robostore.com/products/go2-edu-40-tops-computing-quadruped-robot-dog) · [Generation Robots (EDU Plus)](https://www.generationrobots.com/en/404127-go2-quadruped-robot-edu-plus.html) | Official SDK and DDS, an expansion dock with power outlets (so no separate battery), onboard Jetson, 12 kg max payload. |

### 4.5 Training aids and reference chemicals

| Part | ~$ | Buy | Notes |
|---|---|---|---|
| Live bed bug training vials (sealed, mesh-ended) | 50–150 | [Bed Bug Training Aids LLC](https://bedbugtrainingaids.com/) · [Nattaro Labs K9 aids](https://nattarolabs.com/our-solutions/products/k9-training-equipment-for-dogs/) | Bugs survive about 3 months at room temperature. Store in double containment. |
| Pure-odor aids (no live bugs) | 40–100 | [SOKKS Bed Bug](https://www.rayallen.com/sokks-bed-bug-scent-detection-training-aid/) · [ScentLogix Bed Bug](https://www.rayallen.com/scentlogix-bed-bug-scent-k9-training-aid/) | Safe to use in client homes |
| trans-2-Hexenal 98% (E-2-hexenal) | 40–60 | [Sigma-Aldrich 132659](https://www.sigmaaldrich.com/US/en/product/aldrich/132659) | Used to make calibration standards. Many chemical suppliers only sell to businesses or institutions. |
| trans-2-Octenal | 40–70 | [Sigma-Aldrich search](https://www.sigmaaldrich.com/US/en/search/trans-2-octenal?focus=products&type=product_name) | |
| Dimethyl disulfide | 30 | [Sigma-Aldrich search](https://www.sigmaaldrich.com/US/en/search/dimethyl-disulfide?focus=products&type=product_name) | Very strong smell. Use tiny amounts in a fume hood. |
| Negative / confounder aids: cockroach, other insects | 40 | [Ray Allen K9 training aids](https://www.rayallen.com/) | For negative training data |

### 4.6 Budget roll-up

| Bucket | Low | High |
|---|---|---|
| Phase 0 nose (items 1–8, 11–24, 27–29, 32–34, chemicals, aids) | $550 | $800 |
| Phase 1 wand/portable (30–31, 35, extra tubing) | $80 | $150 |
| Phase 2–3 compute and vision (25, 26, Tenax, heater) | $170 | $300 |
| MiniPID (optional) | $0 | ~$1,000+ (quote) |
| Robot body | $300 (WAVEGO) | $2,800 (Go2 Pro) / $11–15k (EDU) |
| **Total, recommended path (Go2 Pro, no PID)** | **≈ $3,600** | **≈ $4,100** |

---

## 5. Software stack

| Layer | Tool |
|---|---|
| OS | Raspberry Pi OS 64-bit + ROS 2 Jazzy (Docker or native Ubuntu 24.04) |
| Sensor I/O | Adafruit Blinka, `adafruit-circuitpython-{tca9548a,bme680,sht4x,ads1x15}`, raw I2C for the SGP41, `gpiozero` |
| Data + ML | pandas, scikit-learn (RandomForest / gradient boosting), joblib. Optionally Edge Impulse for a microcontroller port |
| Heater profiles | Bosch BME AI-Studio + BME688 Dev Kit; later port to BSEC2 for on-sensor profiles |
| Robot | go2_ros2_sdk (Air/Pro) or unitree_sdk2 (EDU), slam_toolbox, Nav2 |
| Vision | Ultralytics YOLOv8n → Hailo Dataflow Compiler → `hailo-apps` / Picamera2 |

Code in [`firmware/`](firmware/):
- `sniff_logger.py`: runs the purge/sniff/measure cycle, reads all sensors at 2 Hz, writes a CSV with labels.
- `train_classifier.py`: pulls a feature vector out of each sniff, runs grouped cross-validation, saves the model.
- `detector.py`: live inference. Prints P(bed bug), buzzes on an alert, and optionally publishes to ROS 2.

---

## 6. Validation protocol (copied from how detection dogs are certified)

1. **Double-blind:** the person who hides the samples isn't in the room during the search. The operator doesn't know how many samples there are or where.
2. **Per-trial result:** a true positive is an alert within 50 cm of the hidden sample. Any other alert is a false positive.
3. **Mix:** each room gets 0, 1 or 2 positives (chosen at random), plus 2 confounders.
4. **Metrics:** sensitivity, specificity, precision, time per room. Report 95% confidence intervals (Wilson).
5. **Benchmarks:** controlled dog studies (~97%) and field dog studies (~44% detection / ~15% false positives, Cooper 2014).
6. **Drift checks:** re-test with the reference vial each day. Recalibrate the baseline if the response drifts more than 20%.

---

## 7. Safety, ethics and legal

- **Live bed bugs:** keep sealed vials inside a second sealed container. Never open them in an occupied home.
  Kill spent vials by freezing at −18 °C for 4+ days. Tell clients and get their consent if you bring live aids on site.
  Pure-odor aids are the better choice in client homes.
- **Chemicals:** (E)-2-hexenal and 2-octenal are flammable irritants, and DMDS is toxic and very smelly. Read the SDS,
  wear nitrile gloves and eye protection, and work in a fume hood or outdoors. Make dilutions only in sealed vials.
- **Robot:** Go2 sport mode is strong and fast. Keep people and pets clear during testing, keep the remote e-stop in hand,
  and cap speed in Nav2. Keep the robot's firmware updated and put it on an **isolated Wi-Fi network**: there have been
  published security vulnerabilities in consumer robot dogs, including Unitree's BLE setup interface in 2025.
- **Privacy:** the camera only captures at alert stations, and images stay on the device unless the client agrees.
- **Claims:** until Phase 4 data exists, market it as an **inspection aid**, not a certified detector.

---

## 8. Stretch ideas
- Mimic dog sniffing: short, fast pump pulses (about 5 Hz) to get more mixing at the inlet.
- Use the same hardware for other targets (mold, termites, gas leaks) by retraining. Only the classifier changes.
- Multi-room fleet reports for hotels (room-by-room heat maps).
- Port the model to an ESP32-S3 / Nicla Sense ME for a $50 stand-alone "sniff puck" that sits under a bed overnight.

## Sources
- [Volatile Organic Compounds: A Promising Tool for Bed Bug Detection](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10048870/)
- [Bed bug alarm pheromone emission under heat (Sci. Rep. 2024)](https://www.nature.com/articles/s41598-024-57925-y)
- [Oscillator-based trans-2-hexenal sensor array](https://www.sciencedirect.com/science/article/abs/pii/S0925400520315008)
- [Pfiester et al. 2008: dogs detecting live bed bugs and eggs](https://pubmed.ncbi.nlm.nih.gov/18767752/)
- [Cooper et al. 2014: field accuracy of bed bug dogs](https://entomology.rutgers.edu/personnel/changlu-wang/docs/Cooper2014AccuracyCanines.pdf)
- [Trap + thermal desorption for e-noses](https://www.sciencedirect.com/science/article/abs/pii/S0925400500004937)
- [Bosch BME688](https://www.bosch-sensortec.com/en/products/environmental-sensors/gas-sensors/bme688) · [BME688 software](https://www.bosch-sensortec.com/en/software-tools/software/bme688-and-bme690-software)
- [Adafruit SGP41 guide](https://learn.adafruit.com/adafruit-sgp41-multi-pixel-gas-sensor-breakout/overview)
- [Raspberry Pi AI HAT+ docs](https://www.raspberrypi.com/documentation/accessories/ai-hat-plus.html)
- [Unitree Go2 SDK guide](https://support.unitree.com/home/en/developer) · [unitree_sdk2_python](https://github.com/unitreerobotics/unitree_sdk2_python) · [go2_ros2_sdk](https://github.com/abizovnuralem/go2_ros2_sdk)
- [Unitree Go2 EDU buying guide](https://botinfo.ai/articles/unitree-go2-edu)
