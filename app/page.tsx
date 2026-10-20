'use client';
import { useState } from 'react';
import { ArrowRight, BusFront, CalendarDays, Clock3, ExternalLink, Luggage, MapPin, Plane, TrainFront, ChevronDown } from 'lucide-react';

type Stop = { time: string; title: string; detail: string; duration?: string; transport?: string; mapUrl?: string };
type Day = { id: string; date: string; weekday: string; place: string; headline: string; route: string; stay: string; tone: string; stops: Stop[] };

const guideNotes: Record<string, string> = {
  '大須觀音':'這座寺院正式名稱是北野山真福寺寶生院，據說由織田信長之父信秀在 1612 年遷建至此。參拜時先看仁王門與朱印，寺前廣場也常有古著與二手市集。',
  '大須商店街':'大須是由寺院門前町發展出的老街，八個商店街約 1,200 間店混在一起。建議沿仁王門通→新天地通→大須本通走，看到招牌小吃就停，這裡最迷人的就是沒有固定逛法。',
  '飛驒國分寺':'七世紀聖武天皇下令各地建立國分寺，高山這座保留了室町時代的三重塔。境內的大銀杏樹樹齡超過 1,200 年，秋天轉黃時是高山最有氣氛的取景點。',
  '高山陣屋':'這是日本現存唯一完整的江戶幕府郡代官署。穿過玄關後可看大廳、吟味所與米藏；榻榻米房間的高低差，正是昔日官民身分秩序的縮影。',
  '中橋與午餐':'朱紅色中橋是高山的城市名片，橋下的宮川曾是城下町運輸命脈。拍照後往朝市方向找高山拉麵：細捲麵、醬油湯底與飛驒牛，是最適合第一餐的組合。',
  '上三之町老街':'三町古街保留江戶末期木造町家，狹長格局源自商人按地價課稅的時代。留意格子窗、酒藏杉玉與屋簷下的水桶，這些都是防火與商家生活留下的細節。',
  '宮川朝市':'朝市約從清晨開始，最值得看的是高山媽媽們自家醃漬物、味噌與季節水果。先繞一圈再買，部分攤位只收現金；秋天可找飛驒蘋果與栗子點心。',
  '櫻山八幡宮':'高山北側的鎮守社，也是秋季高山祭的主場。參道相對安靜，社殿旁可順看屋台會館；入社前在手水舍洗手，感受日本神社完整參拜順序。',
  '高山祭屋台會館':'館內輪替展示秋祭使用的屋台，每座木雕、金箔與機關都由工匠維護。特別注意屋台頂端的獅子與龍雕刻，它們不是裝飾，而是祈求驅邪與豐收的象徵。',
  '三光稻荷神社':'犬山城主織田家的守護社，粉紅色愛心繪馬與成排鳥居是人氣拍照點。洗錢池的信仰是祈求財運，但記得先投香油錢、再依指示使用竹籠，避免把硬幣直接丟進池裡。',
  '國寶犬山城':'建於 1537 年，天守被認為是日本現存最古老的木造天守之一。登頂最後一段樓梯很陡，但四面可望木曾川與濃尾平原；沿欄杆繞一圈，才能看完整 360 度景色。',
  '有樂苑與如庵':'織田信長弟弟織田有樂齋晚年在此修茶道。國寶茶室如庵的「有樂窓」讓光線像畫一樣落進室內，庭園請放慢腳步看苔、飛石與借景，不必急著拍照。',
  '木曾川河畔夕景':'木曾川是犬山城天然護城河，也是古代中山道交通的一部分。傍晚從犬山遊園站方向回望城堡，夕陽會把白色天守染成金色；雨後水面倒影尤其漂亮。'
};

const flights = [
  { label:'去程', date:'10/30 週五', number:'IT 206', from:'TPE', fromCity:'台北（桃園）', depart:'08:45', to:'NGO', toCity:'名古屋', arrive:'12:25', duration:'2 小時 40 分' },
  { label:'回程', date:'11/03 週二', number:'IT 207', from:'NGO', fromCity:'名古屋', depart:'13:15', to:'TPE', toCity:'台北（桃園）', arrive:'15:50', duration:'3 小時 35 分' },
];

const days: Day[] = [
  { id:'day-1', date:'10/30', weekday:'FRI', place:'名古屋', headline:'落地後，先逛大須的老街與人情味', route:'中部國際機場 → 名古屋站 → 丸之內 → 大須', stay:'Hotel Keihan Nagoya（丸之內站步行約 4 分）', tone:'CITY', stops:[
    { time:'12:25', title:'抵達中部國際機場', detail:'入境、領行李與前往車站預留約 75 分鐘。', duration:'約 1 小時 15 分' },
    { time:'13:45', title:'名鐵 μSKY 前往名古屋', detail:'中部國際機場站上車，於名鐵名古屋站下車；μSKY 全車指定席。', duration:'約 28 分', transport:'名鐵機場線', mapUrl:'https://maps.google.com/?q=Meitetsu+Nagoya+Station' },
    { time:'15:15', title:'飯店寄放行李', detail:'從名鐵名古屋轉地鐵櫻通線至丸之內，出站步行約 4 分抵達飯店；先寄放行李再出發。', duration:'約 30 分', transport:'名古屋→丸之內＋步行', mapUrl:'https://maps.google.com/?q=Hotel+Keihan+Nagoya' },
    { time:'16:00', title:'大須觀音', detail:'從丸之內搭鶴舞線至大須觀音，先參拜古寺，再從仁王門開始逛商店街。', duration:'約 35 分', transport:'地鐵鶴舞線約 5 分＋步行', mapUrl:'https://maps.google.com/?q=Osu+Kannon+Temple' },
    { time:'16:45', title:'大須商店街', detail:'古著、藥妝、零食、咖啡店與小吃集中在街區內，適合邊走邊吃。', duration:'約 2 小時', mapUrl:'https://maps.google.com/?q=Osu+Shopping+Street+Nagoya' },
    { time:'19:00', title:'大須晚餐後回名古屋', detail:'可在大須吃味噌豬排、炸雞翅或台灣拉麵，再搭地鐵回飯店。', duration:'約 1.5 小時', mapUrl:'https://maps.google.com/?q=Osu+Nagoya' },
    { time:'20:45', title:'備選｜JR Gate Tower 夜景', detail:'如果還有體力，再到名古屋站高樓層看夜景；累了就直接回飯店休息。', duration:'約 45 分', mapUrl:'https://maps.google.com/?q=JR+Gate+Tower+Nagoya' },
  ]},
  { id:'day-2', date:'10/31', weekday:'SAT', place:'高山', headline:'乘著特急飛驒，走進山城老街', route:'名古屋 → 高山陣屋 → 上三之町', stay:'Wat Hotel & Spa Hida Takayama', tone:'ALPS', stops:[
    { time:'07:00', title:'退房並寄放大行李', detail:'Hotel Keihan 10/30–10/31 與 11/01–11/03 分開訂房，請櫃台確認可代管 11/01 回房的大行李；只帶一晚小行李。', duration:'約 20 分', transport:'行李安排' },
    { time:'08:43', title:'JR 特急飛驒前往高山', detail:'已訂指定席：名古屋站直達高山站，08:43 出發、10:58 抵達；沿飛驒川的山景也是旅程的一部分。', duration:'約 2 小時 15 分', transport:'JR 特急ひだ｜指定席', mapUrl:'https://maps.google.com/?q=Takayama+Station' },
    { time:'11:05', title:'Wat Hotel & Spa 寄放小行李', detail:'10:58 抵達高山站後，步行約 7 分抵達 Wat Hotel；先寄放小行李，再開始市區散步。', duration:'約 25 分', transport:'高山站步行約 7 分' },
    { time:'11:35', title:'飛驒國分寺', detail:'先看高山站旁的三重塔與大銀杏，再走往高山陣屋，順路不繞路。', duration:'約 35 分', mapUrl:'https://maps.google.com/?q=Hida+Kokubunji+Temple' },
    { time:'12:20', title:'高山陣屋', detail:'江戶時代官署建築，榻榻米空間、庭園與米藏值得慢慢看。', duration:'約 1 小時 15 分', mapUrl:'https://maps.google.com/?q=Takayama+Jinya' },
    { time:'13:35', title:'中橋與午餐', detail:'穿過朱紅中橋，午餐安排高山拉麵或飛驒牛料理。', duration:'約 1 小時 15 分', mapUrl:'https://maps.google.com/?q=Nakabashi+Bridge+Takayama' },
    { time:'14:00', title:'上三之町老街', detail:'木造町家、味噌店、工藝店與老屋咖啡；可試飲當地酒藏。', duration:'約 2.5 小時', mapUrl:'https://maps.google.com/?q=Sanmachi+Historic+District+Takayama' },
    { time:'18:00', title:'飛驒牛晚餐', detail:'燒肉、朴葉味噌或牛排擇一，熱門店建議事先訂位。', duration:'約 1.5 小時' },
  ]},
  { id:'day-3', date:'11/01', weekday:'SUN', place:'高山・名古屋', headline:'朝市與祭屋，午後回到名古屋逛街', route:'宮川朝市 → 櫻山八幡宮 → 高山 → 丸之內 → 榮', stay:'Hotel Keihan Nagoya（丸之內站步行約 4 分）', tone:'MARKET', stops:[
    { time:'08:00', title:'宮川朝市', detail:'沿宮川逛在地蔬果、醃漬物與手作攤位，順便吃早餐。', duration:'約 1 小時', mapUrl:'https://maps.google.com/?q=Miyagawa+Morning+Markets' },
    { time:'09:15', title:'櫻山八幡宮', detail:'穿過安靜街區前往高山北側的古社。', duration:'約 45 分', transport:'朝市步行約 12 分', mapUrl:'https://maps.google.com/?q=Sakurayama+Hachimangu+Shrine' },
    { time:'10:10', title:'高山祭屋台會館', detail:'近距離欣賞高山祭華麗屋台；與八幡宮相鄰。', duration:'約 1 小時', mapUrl:'https://maps.google.com/?q=Takayama+Festival+Floats+Exhibition+Hall' },
    { time:'11:30', title:'備選｜飛驒之里', detail:'想把高山自然景色排滿，可搭巴士前往合掌造民家；若不想趕車，就留在老街吃午餐。', duration:'約 1.5–2 小時', transport:'高山站搭巴士約 10 分', mapUrl:'https://maps.google.com/?q=Hida+Folk+Village' },
    { time:'13:30', title:'老街最後散步與取行李', detail:'不去飛驒之里時，這段可改成老街午餐與伴手禮；之後回 Wat Hotel 取行李，步行約 7 分到車站。', duration:'約 1 小時' },
    { time:'14:46', title:'JR 特急飛驒返回名古屋', detail:'已訂 HIDA 14：14:46 高山站出發、17:05 抵達名古屋站。抵達後搭地鐵櫻通線至丸之內，出站步行約 4 分回 Hotel Keihan。', duration:'2 小時 19 分＋轉乘約 20 分', transport:'JR 特急ひだ HIDA 14｜指定席＋地鐵櫻通線', mapUrl:'https://maps.google.com/?q=Hotel+Keihan+Nagoya' },
    { time:'18:30', title:'榮商圈與久屋大通購物', detail:'以逛街為主：LACHIC、名古屋三越、松坂屋、Central Park 地下街與 RAYARD Hisaya-Odori Park。可依體力選百貨、服飾雜貨、伴手禮或餐廳，不安排 Oasis 21 屋頂與夜景行程。', duration:'約 2.5 小時', transport:'丸之內→榮｜地鐵櫻通線轉東山線約 10 分', mapUrl:'https://www.google.com/maps/search/?api=1&query=Hisaya+Odori+Park+Nagoya' },
  ]},
  { id:'day-4', date:'11/02', weekday:'MON', place:'犬山', headline:'從城下町一路走到木曾川', route:'丸之內 → 名鐵名古屋 → 犬山 → 犬山遊園 → 名古屋', stay:'Hotel Keihan Nagoya（丸之內站步行約 4 分）', tone:'CASTLE', stops:[
    { time:'08:10', title:'飯店出發・名鐵前往犬山', detail:'從丸之內搭地鐵櫻通線至名古屋，再步行轉名鐵；建議抓 20–25 分鐘轉乘，搭犬山線快速特急或特急。', duration:'約 50–60 分', transport:'地鐵櫻通線＋名鐵犬山線', mapUrl:'https://maps.google.com/?q=Inuyama+Station' },
    { time:'09:00', title:'犬山城下町', detail:'沿本町通散步，老屋、小吃與工藝店集中在登城路線上。', duration:'約 1 小時', transport:'犬山站步行約 10 分', mapUrl:'https://maps.google.com/?q=Inuyama+Castle+Town' },
    { time:'10:05', title:'三光稻荷神社', detail:'紅鳥居、洗錢池與愛心繪馬；神社就在犬山城入口旁。', duration:'約 30 分', mapUrl:'https://maps.google.com/?q=Sanko+Inari+Shrine' },
    { time:'10:40', title:'針綱神社與城山散步', detail:'穿過針綱神社參道上城，沿途是樹蔭與古社。', duration:'約 35 分', mapUrl:'https://maps.google.com/?q=Haritsuna+Shrine' },
    { time:'11:20', title:'國寶犬山城', detail:'登上現存木造天守，最上層可遠眺木曾川。', duration:'約 1 小時 15 分', mapUrl:'https://maps.google.com/?q=Inuyama+Castle' },
    { time:'12:45', title:'城下町午餐', detail:'可選飛驒牛握壽司、田樂、蕎麥麵。', duration:'約 1 小時' },
    { time:'14:00', title:'本町通甜點與伴手禮', detail:'補買栗子甜點、醃漬物與地方伴手禮。', duration:'約 45 分', mapUrl:'https://maps.google.com/?q=Honmachi+Street+Inuyama' },
    { time:'14:50', title:'有樂苑與如庵', detail:'安靜的日式庭園與國寶茶室。', duration:'約 1 小時 15 分', mapUrl:'https://maps.google.com/?q=Urakuen+Garden' },
    { time:'16:25', title:'木曾川河畔夕景', detail:'沿河散步至犬山遊園站，從不同角度回望犬山城。', duration:'約 50 分', transport:'步行約 15–20 分', mapUrl:'https://maps.google.com/?q=Inuyamayuen+Station' },
    { time:'17:25', title:'返回名古屋・晚餐', detail:'犬山遊園站搭名鐵回名古屋。', duration:'約 30–40 分', transport:'名鐵犬山線' },
  ]},
  { id:'day-5', date:'11/03', weekday:'TUE', place:'返程', headline:'留足時間，從容回家', route:'名古屋站 → 中部國際機場 → 桃園', stay:'今晚回家', tone:'FLIGHT', stops:[
    { time:'08:00', title:'早餐、取行李與退房', detail:'從 Hotel Keihan 退房；先確認護照、行李與機場交通票券。', duration:'約 30 分' },
    { time:'08:30', title:'飯店→名鐵名古屋', detail:'丸之內站搭地鐵櫻通線至名古屋，步行轉名鐵；預留轉乘與找月台時間。', duration:'約 20–25 分', transport:'地鐵櫻通線', mapUrl:'https://maps.google.com/?q=Meitetsu+Nagoya+Station' },
    { time:'09:20', title:'名鐵 μSKY 前往機場', detail:'全車指定席，抵達中部國際機場約 09:48；距離 13:15 航班仍有充足緩衝。', duration:'約 28 分', transport:'名鐵 μSKY', mapUrl:'https://maps.google.com/?q=Chubu+Centrair+International+Airport' },
    { time:'10:00', title:'抵達機場', detail:'辦理登機、午餐與採買伴手禮。', duration:'約 3 小時' },
    { time:'13:15', title:'IT 207 返回桃園', detail:'預計 15:50 抵達桃園國際機場。', duration:'3 小時 35 分', transport:'台灣虎航' },
  ]},
];

const prepItems = [
  ['現在可處理','確認兩間飯店訂房姓名、日期與取消規則；向 Hotel Keihan 詢問 10/31 大行李寄放。'],
  ['已完成','JR 特急飛驒去程與回程指定席均已購買；去程 10/31 08:43→10:58，回程 11/01 HIDA 14 14:46→17:05。'],
  ['出發前 1–2 週','確認犬山城、貴賓庭園與高山祭屋台會館開放時間；熱門飛驒牛餐廳訂位。'],
  ['出發前 1 週','預留名鐵 μSKY 機場車票；準備 Suica/ICOCA、日幣現金與海外網路。'],
  ['出發前 1–2 天','查看航班、JR/名鐵運行狀況與天氣；截圖飯店地址、車站出口與車票。'],
];

const routes = [
  ['中部機場 → Hotel Keihan','名鐵 μSKY：中部國際機場→名鐵名古屋（約 28 分）→地鐵櫻通線至丸之內→步行約 4 分','約 60–90 分（含入境、取行李）'],
  ['Hotel Keihan → 高山','丸之內→名古屋（櫻通線）→JR 特急飛驒→高山站→步行約 7 分到 Wat Hotel','約 3 小時 10 分'],
  ['Wat Hotel → 名古屋飯店','高山站搭 JR 特急飛驒→名古屋→櫻通線至丸之內→步行約 4 分到 Hotel Keihan','約 3 小時'],
  ['Hotel Keihan → 犬山','丸之內→名古屋（櫻通線）→名鐵犬山線快速特急/特急→犬山站','約 50–60 分'],
  ['Hotel Keihan → 中部機場','丸之內→名古屋→名鐵 μSKY→中部國際機場；回程建議至少提前 3 小時到機場','約 50–60 分'],
];

const restaurantList = [
  ['10/30｜大須','Pizzeria Braceria CESARI!!','世界披薩冠軍店；媽媽可點瑪格麗特披薩，你可另點肉類。','大須觀音附近','https://www.google.com/maps/search/?api=1&query=Pizzeria+Braceria+CESARI+Nagoya'],
  ['10/30｜大須備選','印度料理／蔬食咖哩','可直接選蔬菜咖哩、烤餅；比名古屋肉料理更容易一起吃。','大須商店街內搜尋','https://www.google.com/maps/search/?api=1&query=vegetarian+Indian+restaurant+Osu+Nagoya'],
  ['10/31｜高山晚餐','Suzuya 壽壽や','有 Vegetarian-yaki：蔬菜、菇類、豆腐與味噌；你也可點飛驒牛。建議訂位。','高山老街步行範圍','https://www.google.com/maps/search/?api=1&query=Suzuya+Takayama'],
  ['11/01｜高山午餐','Cha Cha Tororo','山藥泥飯、山藥蕎麥麵等半素料理；可現場確認湯底即可。','高山老街周邊','https://www.google.com/maps/search/?api=1&query=Cha+Cha+Tororo+Takayama'],
  ['11/01｜榮晚餐','名古屋榮三越 9F 餐廳街','百貨餐廳選擇多，媽媽可挑蔬菜、麵、壽司或咖哩；也方便休息與上洗手間。','榮站直結','https://www.google.com/maps/search/?api=1&query=Nagoya+Sakae+Mitsukoshi'],
  ['11/02｜犬山午餐','Hotel Indigo Yamateras','有 Vegetarian／Vegan 選項，想吃得舒服可先訂位並註明鍋邊素。','犬山有樂苑旁','https://www.google.com/maps/search/?api=1&query=Indigo+Home+Kitchen+Yamateras+Inuyama'],
  ['11/02｜犬山備選','犬山城下町蕎麥麵／豆皮壽司','適合臨時決定；你可買飛驒牛握壽司，媽媽吃蕎麥麵或豆皮壽司。','本町通周邊搜尋','https://www.google.com/maps/search/?api=1&query=vegetarian+restaurant+Inuyama+Castle+Town'],
];

function FlightCard({ flight }: { flight: (typeof flights)[number] }) {
  return <article className="flight-card"><div className="flight-top"><span className="chip"><Plane size={15}/>{flight.label}</span><span>{flight.date}</span><strong>{flight.number}</strong></div><div className="flight-route"><div><b>{flight.depart}</b><strong>{flight.from}</strong><span>{flight.fromCity}</span></div><div className="flight-line"><Plane size={18}/><span>{flight.duration}</span></div><div><b>{flight.arrive}</b><strong>{flight.to}</strong><span>{flight.toCity}</span></div></div></article>;
}

export default function Home() {
  const [activeDay, setActiveDay] = useState(0);
  const day = days[activeDay];
  return <main>
    <header className="masthead"><div className="eyebrow"><span>TRIP No. 1030</span><span>5 DAYS · 4 NIGHTS</span></div><div className="title-row"><div><p className="kicker">2026 秋・中部地方</p><h1>名古屋<br/>犬山・高山</h1></div><div className="stamp"><span>母女旅行</span><b>10.30</b><span>— 11.03</span></div></div><p className="intro">城市、國寶古城與飛驒山城。三晚名古屋、一晚高山，把移動留在風景裡。</p><div className="flights">{flights.map(f=><FlightCard key={f.number} flight={f}/>)}</div></header>
    <nav className="day-nav" aria-label="每日行程">{days.map((d,i)=><button className={activeDay===i?'active':''} onClick={()=>setActiveDay(i)} key={d.id}><small>DAY {i+1}</small><b>{d.date}</b><span>{d.place}</span></button>)}</nav>
    <div className="itinerary"><section className="day-section" id={day.id}><aside className="day-aside"><span className="day-number">0{activeDay+1}</span><div className="place-tag">{day.tone}</div><p>{day.weekday}</p><h2>{day.date}</h2><h3>{day.place}</h3><p className="day-headline">{day.headline}</p><div className="route-box"><MapPin size={18}/><span>{day.route}</span></div><div className="stay"><span>STAY</span><b>{day.stay}</b></div></aside><div className="timeline">{(activeDay===1||activeDay===3)&&<figure className="day-photo"><img src={activeDay===1?'/images/takayama-nakabashi.jpg':'/images/inuyama-castle.jpg'} alt={activeDay===1?'秋日高山中橋':'秋日犬山城庭院'}/><figcaption>{activeDay===1?'飛驒高山・中橋':'犬山・國寶城下町'}</figcaption></figure>}{day.stops.map(s=><article className="stop" key={`${day.id}-${s.time}-${s.title}`}><time>{s.time}</time><div className="dot"/><div className="stop-body"><div className="stop-heading"><h4>{s.title}</h4>{s.duration&&<span><Clock3 size={14}/>{s.duration}</span>}</div><p>{s.detail}</p>{guideNotes[s.title]&&<details><summary>導遊解說・必看點 <ChevronDown size={16}/></summary><p>{guideNotes[s.title]}</p></details>}<div className="stop-meta">{s.transport&&<span>{s.transport.includes('JR')||s.transport.includes('名鐵')?<TrainFront size={15}/>:<BusFront size={15}/>} {s.transport}</span>}{s.mapUrl&&<a href={s.mapUrl} target="_blank" rel="noreferrer">Google Maps <ExternalLink size={14}/></a>}</div></div></article>)}</div></section></div>
    <section className="planning-grid"><div className="planning-panel"><h2>交通路線總表</h2>{routes.map(([route,steps,time])=><div className="route-row" key={route}><b>{route}</b><span>{steps}</span><em>{time}</em></div>)}</div></section>
    <section className="restaurant-section"><div className="section-heading"><p>FOOD NOTES</p><h2>這趟可以吃什麼</h2><span>以媽媽可接受鍋邊素為前提，先列最值得安排的店；點店名即可開 Google Maps。</span></div><div className="restaurant-grid">{restaurantList.map(([day,name,note,area,map])=><article className="restaurant-card" key={name}><div className="restaurant-day">{day}</div><h3>{name}</h3><p>{note}</p><small>{area}</small><a href={map} target="_blank" rel="noreferrer">開啟 Google Maps <ExternalLink size={14}/></a></article>)}</div></section>
    <section className="travel-card"><div><CalendarDays/><p><b>住宿</b><br/>名古屋：Hotel Keihan Nagoya；高山：Wat Hotel &amp; Spa Hida Takayama。</p></div><ArrowRight className="arrow"/><div><Luggage/><p><b>行李安排</b><br/>10/31 從名古屋出發前寄放大行李，11/01 回名古屋後取回。</p></div></section>
    <footer><p>交通時間為行程規劃用預估值。列車班次、營業時間與票價可能調整，請於出發前再次確認官方資訊。</p><p className="credits">圖片來源：<a href="https://www.ana.co.jp/en/us/japan-travel-planner/aichi/0000004.html">ANA Japan Travel Planner</a>、<a href="https://www.hidatakayama.or.jp/modelCourse/detail_50.html">飛驒高山官方旅遊指南</a></p></footer>
  </main>;
}
