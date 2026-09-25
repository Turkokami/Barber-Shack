# Robo-K9: Robot Scent-Detection Dog (Proof of Concept: Bed Bugs)

A quadruped robot with an electronic nose ("e-nose") that walks a room, sniffs likely hiding
spots, and **sits** when it smells bed bugs, the way a trained detection dog alerts.

| Doc | What's in it |
|---|---|
| [BUILD_PLAN.md](BUILD_PLAN.md) | Research summary, architecture, phased plan with go/no-go gates, full BOM with purchase links, budget, timeline, validation protocol, safety |
| [SCHEMATICS.md](SCHEMATICS.md) | System block diagram, airflow (pneumatic) schematic, electrical schematic, Pi 5 pin map, I2C address map, power budget, snout/chamber mechanical drawing |
| [BOM.csv](BOM.csv) | Machine-readable bill of materials (import into a spreadsheet to order) |
| [firmware/](firmware/) | Raspberry Pi 5 code: sniff-cycle controller + data logger, classifier training, live detector |

## One-paragraph summary

Bed bugs give off a known chemical signature: the alarm pheromone **(E)-2-hexenal + (E)-2-octenal**
(about a 70/30 blend), their 4-oxo derivatives in shed skins, and the aggregation-pheromone
components **dimethyl disulfide, dimethyl trisulfide, 2-hexanone and histamine**. We build a pumped
e-nose from a **sensor array**: 2x Bosch BME688 running different heater profiles, a Sensirion SGP41,
Figaro TGS2602 and TGS2620 MOS sensors, and an optional ION Science MiniPID 2 PPB for extra
sensitivity. Air goes in through a "snout" into a sealed chamber, and the sensors between sniffs
get a clean-air purge through a carbon filter. A Raspberry Pi 5 runs the sniff cycle and an ML
classifier. The nose rides on a Unitree Go2, which maps the room with its built-in LiDAR (ROS 2 +
Nav2), stops at waypoints along the bed, baseboards and furniture, and sniffs. When the classifier
fires, the robot **sits**, beeps, and drops a pin on the map. A camera plus Hailo AI accelerator
adds a second, visual check (bugs, shed skins, fecal spots).

## The most important rule in this plan

**Prove the nose before you buy the dog.** Phase 0 is a ~$600 benchtop e-nose. If it can't reliably
tell bed-bug training aids apart from blanks and look-alike smells in a blinded test, legs won't
fix that. The plan has an explicit go/no-go gate for this.
