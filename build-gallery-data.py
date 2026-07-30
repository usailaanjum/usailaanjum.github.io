import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MEDIA = ROOT / "media"


def image_paths(folder: Path) -> list[str]:
    return [
        path.relative_to(ROOT).as_posix()
        for path in sorted(folder.glob("*.jpg"), key=lambda item: item.name.lower())
    ]


location_order = {
    "2026": ["Jasper", "Banff", "Calgary", "Drumheller", "Edmonton"],
    "2025": ["Las Vegas"],
    "2024": ["Bernina Express", "Milan", "Venice", "London", "Paris", "Punta Cana"],
}

travel = []
for year in ("2026", "2025", "2024"):
    locations = []
    for location in location_order[year]:
        folder = MEDIA / "travel" / year / location
        images = image_paths(folder)
        if images:
            locations.append({"name": location, "images": images})
    travel.append({"year": year, "locations": locations})

gallery_data = {
    "cat": image_paths(MEDIA / "cat"),
    "plant": image_paths(MEDIA / "plant"),
    "travel": travel,
}

(ROOT / "gallery-data.js").write_text(
    "window.GALLERY_DATA = "
    + json.dumps(gallery_data, indent=2, ensure_ascii=False)
    + ";\n",
    encoding="utf-8",
)
