import requests
from datetime import datetime
from backend.app.database import SessionLocal
from backend.app import models, crud, schemas

# 東京の緯度経度
LAT = 35.6895
LON = 139.6917

def fetch_weather():
    url = f"https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo"
    response = requests.get(url)
    data = response.json()
    
    today = data['daily']['time'][0]
    max_temp = data['daily']['temperature_2m_max'][0]
    min_temp = data['daily']['temperature_2m_min'][0]
    weather_code = data['daily']['weathercode'][0]
    
    # 天気コードの簡易変換
    weather_map = {
        0: "快晴", 1: "晴れ", 2: "一部曇", 3: "曇り",
        45: "霧", 48: "霧",
        51: "小雨", 53: "雨", 55: "強い雨",
        61: "雨", 63: "雨", 65: "強い雨",
        71: "雪", 73: "雪", 75: "強い雪",
        80: "にわか雨", 81: "にわか雨", 82: "激しいにわか雨",
        95: "雷雨", 96: "雷雨", 99: "雷雨"
    }
    weather_desc = weather_map.get(weather_code, "不明")
    
    return f"【今日の天気予報】\n日付: {today}\n天気: {weather_desc}\n最高気温: {max_temp}℃\n最低気温: {min_temp}℃"

def post_to_bbs():
    db = SessionLocal()
    try:
        # 管理者ユーザーを取得 (ID: 3)
        admin_user = db.query(models.User).filter(models.User.id == 3).first()
        if not admin_user:
            print("Admin user not found.")
            return
        
        # 「日常情報」カテゴリを取得 (ID: 4)
        category = db.query(models.Category).filter(models.Category.id == 4).first()
        if not category:
            print("Category '日常情報' not found.")
            return
        
        weather_info = fetch_weather()
        title = f"【自動】今日の天気予報 ({datetime.now().strftime('%Y-%m-%d')})"
        
        # スレッド作成
        thread_data = schemas.ThreadCreate(title=title, category_id=category.id)
        db_thread = crud.create_thread(db, thread=thread_data, author_id=admin_user.id)
        
        # 最初の投稿
        post_data = schemas.PostCreate(content=weather_info, thread_id=db_thread.id)
        crud.create_post(db, post=post_data, author_id=admin_user.id)
        
        print(f"Posted weather info: {title}")
    finally:
        db.close()

if __name__ == "__main__":
    post_to_bbs()
