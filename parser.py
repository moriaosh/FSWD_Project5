import json

# נתיב לקובץ db.json בתיקייה הראשית
DB_PATH = 'db.json'

# אילו שדות להמיר לכל סוג אובייקט
FIELDS_TO_CONVERT = {
    'users': ['id'],
    'albums': ['id', 'userId'],
    'posts': ['id', 'userId'],
    'todos': ['id', 'userId'],
    'photos': ['id', 'albumId'],
    'comments': ['id', 'postId']
}

def convert_fields(obj, fields):
    for field in fields:
        if field in obj:
            try:
                obj[field] = int(obj[field])
            except (ValueError, TypeError):
                print(f"שדה לא ניתן להמרה למספר: {field} = {obj.get(field)}")

# קריאה מהקובץ
with open(DB_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

# ביצוע ההמרה על כל משאב
for resource, fields in FIELDS_TO_CONVERT.items():
    if resource in data:
        for item in data[resource]:
            convert_fields(item, fields)

# הדפסת כמה שורות ראשונות מה-todos לבדיקה
if "todos" in data:
    print("\n📋 דוגמאות ראשונות מה-todos אחרי ההמרה:")
    for i in range(min(5, len(data["todos"]))):
        print(data["todos"][i])

# כתיבה חזרה לקובץ
with open(DB_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\n✅ סיום: הקובץ נשמר, והשדות הומרו למספרים.")
