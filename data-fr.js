// [français, prononciation (API), 中文, pinyin, emoji]
const CATS=[
{id:"salut",name:"Salutations · 问候",icon:"👋",color:"#f77f00",items:[
["Bonjour","bɔ̃.ʒuʁ","你好 / 早上好","nǐ hǎo","👋"],["Bonsoir","bɔ̃.swaʁ","晚上好","wǎnshang hǎo","🌆"],["Salut","sa.ly","嗨 / 再见（随意）","hāi","🤙"],
["Au revoir","o ʁə.vwaʁ","再见","zàijiàn","👋"],["Merci","mɛʁ.si","谢谢","xièxie","🙏"],["S'il vous plaît","sil vu plɛ","请","qǐng","🙏"],
["De rien","də ʁjɛ̃","不客气","bú kèqi","😊"],["Pardon","paʁ.dɔ̃","对不起 / 打扰一下","duìbuqǐ","🙇"],["Oui","wi","是 / 对","shì","✅"],["Non","nɔ̃","不 / 不是","bù","❌"],
["Bonne nuit","bɔn nɥi","晚安","wǎn'ān","🌙"],["À demain","a də.mɛ̃","明天见","míngtiān jiàn","📆"],["Comment ça va ?","kɔ.mɑ̃ sa va","你好吗？","nǐ hǎo ma","❓"],
["Ça va bien","sa va bjɛ̃","我很好","wǒ hěn hǎo","😄"],["Enchanté","ɑ̃.ʃɑ̃.te","很高兴认识你","hěn gāoxìng rènshi nǐ","🤝"]]},
{id:"presente",name:"Se présenter · 自我介绍",icon:"🙋",color:"#e63946",items:[
["Je m'appelle","ʒə ma.pɛl","我叫……","wǒ jiào","🏷️"],["Je suis","ʒə sɥi","我是","wǒ shì","🙋"],["Tu es","ty ɛ","你是","nǐ shì","👉"],["le nom","lə nɔ̃","姓","xìng","📛"],
["le prénom","lə pʁe.nɔ̃","名","míng","✍️"],["l'âge","laʒ","年龄","niánlíng","🎂"],["Quel âge as-tu ?","kɛl aʒ a ty","你几岁？","nǐ jǐ suì","🎈"],["J'habite","ʒa.bit","我住在","wǒ zhù zài","🏠"],
["la France","la fʁɑ̃s","法国","Fǎguó","🇫🇷"],["la Chine","la ʃin","中国","Zhōngguó","🇨🇳"],["français","fʁɑ̃.sɛ","法国的 / 法语","Fǎyǔ","🥖"],["chinois","ʃi.nwa","中国的 / 中文","Zhōngwén","🏮"],
["étudiant","e.ty.djɑ̃","学生（大学）","xuésheng","🎓"],["professeur","pʁɔ.fɛ.sœʁ","老师","lǎoshī","👩‍🏫"],["ami","a.mi","朋友","péngyou","🧑‍🤝‍🧑"]]},
{id:"nombres",name:"Nombres · 数字",icon:"🔢",color:"#2a9d8f",items:[
["un","œ̃","一","yī","1️⃣"],["deux","dø","二","èr","2️⃣"],["trois","tʁwa","三","sān","3️⃣"],["quatre","katʁ","四","sì","4️⃣"],["cinq","sɛ̃k","五","wǔ","5️⃣"],["six","sis","六","liù","6️⃣"],
["sept","sɛt","七","qī","7️⃣"],["huit","ɥit","八","bā","8️⃣"],["neuf","nœf","九","jiǔ","9️⃣"],["dix","dis","十","shí","🔟"],["vingt","vɛ̃","二十","èrshí","2️⃣0️⃣"],["cent","sɑ̃","一百","yībǎi","💯"],["zéro","ze.ʁo","零","líng","0️⃣"]]},
{id:"etre",name:"Verbes essentiels · 最常用动词",icon:"⭐",color:"#d62828",items:[
["être","ɛtʁ","是","shì","🧍"],["avoir","a.vwaʁ","有","yǒu","🤲"],["aller","a.le","去","qù","🚶"],["faire","fɛʁ","做 / 干","zuò","🛠️"],["pouvoir","pu.vwaʁ","能 / 可以","néng","💪"],["vouloir","vu.lwaʁ","想要","xiǎng yào","🙏"],
["devoir","də.vwaʁ","必须 / 应该","bìxū","📌"],["savoir","sa.vwaʁ","知道 / 会","zhīdao","🧠"],["venir","və.niʁ","来","lái","🏃"],["prendre","pʁɑ̃dʁ","拿 / 乘（车）","ná","🫴"],["dire","diʁ","说","shuō","💬"],
["donner","dɔ.ne","给","gěi","🎁"],["voir","vwaʁ","看见","kànjiàn","👀"],["mettre","mɛtʁ","放 / 穿","fàng","📥"],["aimer","ɛ.me","爱 / 喜欢","ài / xǐhuan","❤️"]]},
{id:"conj",name:"Conjugaison (présent) · 现在时变位",icon:"🔁",color:"#3a6ea5",items:[
["je suis","ʒə sɥi","我是","wǒ shì","🙋"],["tu es","ty ɛ","你是","nǐ shì","👉"],["il est","il ɛ","他是","tā shì","👨"],["nous sommes","nu sɔm","我们是","wǒmen shì","👫"],["vous êtes","vu zɛt","您 / 你们是","nín shì","👥"],["ils sont","il sɔ̃","他们是","tāmen shì","👬"],
["j'ai","ʒe","我有","wǒ yǒu","🤲"],["tu as","ty a","你有","nǐ yǒu","🎁"],["il a","il a","他有","tā yǒu","👨"],["nous avons","nu za.vɔ̃","我们有","wǒmen yǒu","👫"],["je vais","ʒə vɛ","我去","wǒ qù","🚶"],["tu vas","ty va","你去","nǐ qù","🚶‍♀️"],
["nous allons","nu za.lɔ̃","我们去","wǒmen qù","🚌"],["je fais","ʒə fɛ","我做","wǒ zuò","🛠️"],["je peux","ʒə pø","我可以","wǒ kěyǐ","💪"],["je veux","ʒə vø","我想要","wǒ xiǎng yào","🙏"],["je parle","ʒə paʁl","我说","wǒ shuō","🗣️"],["je mange","ʒə mɑ̃ʒ","我吃","wǒ chī","🍽️"]]},
{id:"verbes",name:"Verbes de la classe · 课堂与日常动词",icon:"🏫",color:"#9b5de5",items:[
["parler","paʁ.le","说话","shuōhuà","🗣️"],["écouter","e.ku.te","听","tīng","👂"],["regarder","ʁə.gaʁ.de","看","kàn","👁️"],["lire","liʁ","读","dú","📖"],["écrire","e.kʁiʁ","写","xiě","✏️"],["comprendre","kɔ̃.pʁɑ̃dʁ","明白 / 懂","dǒng","💡"],
["apprendre","a.pʁɑ̃dʁ","学习","xué","📚"],["répéter","ʁe.pe.te","重复","chóngfù","🔁"],["demander","də.mɑ̃.de","问 / 要求","wèn","🙋"],["répondre","ʁe.pɔ̃dʁ","回答","huídá","💬"],["ouvrir","u.vʁiʁ","打开","dǎkāi","🔓"],
["fermer","fɛʁ.me","关上","guān","🔒"],["chercher","ʃɛʁ.ʃe","找","zhǎo","🔍"],["trouver","tʁu.ve","找到 / 觉得","zhǎodào","✅"],["aider","e.de","帮助","bāngzhù","🤝"],["attendre","a.tɑ̃dʁ","等","děng","⏳"],
["commencer","kɔ.mɑ̃.se","开始","kāishǐ","▶️"],["finir","fi.niʁ","结束 / 完成","jiéshù","🏁"],["travailler","tʁa.va.je","工作","gōngzuò","💼"],["habiter","a.bi.te","居住","zhù","🏠"],["manger","mɑ̃.ʒe","吃","chī","🍽️"],["boire","bwaʁ","喝","hē","🥤"],
["acheter","aʃ.te","买","mǎi","🛒"],["dormir","dɔʁ.miʁ","睡觉","shuìjiào","😴"],["partir","paʁ.tiʁ","离开 / 出发","líkāi","🧳"],["arriver","a.ʁi.ve","到达","dàodá","📍"],["appeler","a.pə.le","打电话 / 称呼","dǎ diànhuà","📞"]]},
{id:"famille",name:"Famille · 家庭",icon:"👨‍👩‍👧",color:"#9b5de5",items:[
["la mère","la mɛʁ","妈妈","māma","👩"],["le père","lə pɛʁ","爸爸","bàba","👨"],["le frère","lə fʁɛʁ","哥哥 / 弟弟","gēge / dìdi","👦"],["la sœur","la sœʁ","姐姐 / 妹妹","jiějie / mèimei","👧"],
["le fils","lə fis","儿子","érzi","🧒"],["la fille","la fij","女儿 / 女孩","nǚ'ér","👧"],["le mari","lə ma.ʁi","丈夫","zhàngfu","🤵"],["la femme","la fam","妻子 / 女人","qīzi","👰"],
["l'enfant","lɑ̃.fɑ̃","孩子","háizi","🧒"],["la grand-mère","la gʁɑ̃.mɛʁ","奶奶 / 外婆","nǎinai","👵"],["le grand-père","lə gʁɑ̃.pɛʁ","爷爷 / 外公","yéye","👴"],["la famille","la fa.mij","家庭","jiātíng","👨‍👩‍👧"]]},
{id:"manger",name:"Manger & boire · 饮食",icon:"🥖",color:"#f4a300",items:[
["le pain","lə pɛ̃","面包","miànbāo","🍞"],["l'eau","lo","水","shuǐ","💧"],["le lait","lə lɛ","牛奶","niúnǎi","🥛"],["le café","lə ka.fe","咖啡","kāfēi","☕"],["le thé","lə te","茶","chá","🍵"],
["le riz","lə ʁi","米饭","mǐfàn","🍚"],["la viande","la vjɑ̃d","肉","ròu","🥩"],["le poisson","lə pwa.sɔ̃","鱼","yú","🐟"],["la pomme","la pɔm","苹果","píngguǒ","🍎"],["le fromage","lə fʁɔ.maʒ","奶酪","nǎilào","🧀"],
["l'œuf","lœf","鸡蛋","jīdàn","🥚"],["le légume","lə le.gym","蔬菜","shūcài","🥦"],["le gâteau","lə ga.to","蛋糕","dàngāo","🍰"],["le vin","lə vɛ̃","葡萄酒","pútaojiǔ","🍷"]]},
{id:"resto",name:"Au restaurant · 餐厅",icon:"🍽️",color:"#e76f51",items:[
["la carte","la kaʁt","菜单","càidān","📜"],["l'addition","la.di.sjɔ̃","账单","zhàngdān","🧾"],["une table","yn tabl","一张桌子","yì zhāng zhuōzi","🪑"],["le serveur","lə sɛʁ.vœʁ","服务员","fúwùyuán","🤵"],["l'entrée","lɑ̃.tʁe","前菜","qiáncài","🥗"],
["le plat","lə pla","主菜","zhǔcài","🍝"],["le dessert","lə de.sɛʁ","甜点","tiándiǎn","🍮"],["Je voudrais","ʒə vu.dʁɛ","我想要","wǒ xiǎng yào","🙏"],["C'est combien ?","sɛ kɔ̃.bjɛ̃","多少钱？","duōshao qián","💶"],["C'est délicieux","sɛ de.li.sjø","真好吃","zhēn hǎochī","😋"],
["une fourchette","yn fuʁ.ʃɛt","叉子","chāzi","🍴"],["un couteau","œ̃ ku.to","刀","dāo","🔪"],["une cuillère","yn kɥi.jɛʁ","勺子","sháozi","🥄"],["un verre","œ̃ vɛʁ","杯子","bēizi","🥂"]]},
{id:"docteur",name:"Chez le docteur · 看医生",icon:"🩺",color:"#2bb673",items:[
["le médecin","lə med.sɛ̃","医生","yīshēng","👨‍⚕️"],["l'hôpital","lo.pi.tal","医院","yīyuàn","🏥"],["la pharmacie","la faʁ.ma.si","药店","yàodiàn","💊"],["le médicament","lə me.di.ka.mɑ̃","药","yào","💊"],
["J'ai mal","ʒe mal","我疼","wǒ téng","😣"],["la tête","la tɛt","头","tóu","🤕"],["le ventre","lə vɑ̃tʁ","肚子","dùzi","🤢"],["la gorge","la gɔʁʒ","喉咙","hóulóng","😮"],["la dent","la dɑ̃","牙齿","yáchǐ","🦷"],
["la fièvre","la fjɛvʁ","发烧","fāshāo","🤒"],["la toux","la tu","咳嗽","késou","😷"],["Je suis malade","ʒə sɥi ma.lad","我生病了","wǒ shēngbìng le","🤧"],["une ordonnance","yn ɔʁ.dɔ.nɑ̃s","处方","chǔfāng","📝"],["Au secours !","o sə.kuʁ","救命！","jiùmìng","🆘"]]},
{id:"corps",name:"Le corps · 身体",icon:"🧍",color:"#e63946",items:[
["la main","la mɛ̃","手","shǒu","✋"],["le pied","lə pje","脚","jiǎo","🦶"],["le bras","lə bʁa","手臂","shǒubì","💪"],["la jambe","la ʒɑ̃b","腿","tuǐ","🦵"],["l'œil","lœj","眼睛","yǎnjing","👁️"],["la bouche","la buʃ","嘴","zuǐ","👄"],
["le nez","lə ne","鼻子","bízi","👃"],["l'oreille","lɔ.ʁɛj","耳朵","ěrduo","👂"],["le dos","lə do","背","bèi","🔙"],["le cœur","lə kœʁ","心脏","xīnzàng","❤️"]]},
{id:"couleurs",name:"Couleurs & adjectifs · 颜色和形容词",icon:"🎨",color:"#e76f51",items:[
["rouge","ʁuʒ","红色","hóngsè","🔴"],["bleu","blø","蓝色","lánsè","🔵"],["vert","vɛʁ","绿色","lǜsè","🟢"],["jaune","ʒon","黄色","huángsè","🟡"],["noir","nwaʁ","黑色","hēisè","⚫"],["blanc","blɑ̃","白色","báisè","⚪"],
["grand","gʁɑ̃","大 / 高","dà / gāo","🦒"],["petit","pə.ti","小 / 矮","xiǎo","🐜"],["beau","bo","漂亮","piàoliang","🌟"],["bon","bɔ̃","好（味道、质量）","hǎo","👍"],["chaud","ʃo","热","rè","🥵"],["froid","fʁwa","冷","lěng","🥶"]]},
{id:"vetements",name:"Vêtements · 衣服",icon:"👕",color:"#f72585",items:[
["le pantalon","lə pɑ̃.ta.lɔ̃","裤子","kùzi","👖"],["la chemise","la ʃə.miz","衬衫","chènshān","👔"],["le t-shirt","lə ti.ʃœʁt","T恤","T xù","👕"],["la robe","la ʁɔb","连衣裙","liányīqún","👗"],["le manteau","lə mɑ̃.to","大衣","dàyī","🧥"],
["les chaussures","le ʃo.syʁ","鞋子","xiézi","👟"],["le chapeau","lə ʃa.po","帽子","màozi","🎩"],["les lunettes","le ly.nɛt","眼镜","yǎnjìng","👓"],["le sac","lə sak","包","bāo","👜"],["Quelle taille ?","kɛl taj","什么尺码？","shénme chǐmǎ","📏"]]},
{id:"courses",name:"Courses & argent · 购物",icon:"🛒",color:"#ffb703",items:[
["le marché","lə maʁ.ʃe","市场","shìchǎng","🧺"],["le supermarché","lə sy.pɛʁ.maʁ.ʃe","超市","chāoshì","🏬"],["l'argent","laʁ.ʒɑ̃","钱","qián","💶"],["cher","ʃɛʁ","贵","guì","💸"],["pas cher","pa ʃɛʁ","便宜","piányi","🏷️"],
["payer","pɛ.je","付款","fùkuǎn","💳"],["la carte bancaire","la kaʁt bɑ̃.kɛʁ","银行卡","yínhángkǎ","💳"],["un euro","œ̃ nø.ʁo","一欧元","yī Ōuyuán","💶"],["le sac","lə sak","袋子","dàizi","🛍️"],["la boulangerie","la bu.lɑ̃ʒ.ʁi","面包店","miànbāodiàn","🥐"]]},
{id:"lieux",name:"Lieux & transports · 地点和交通",icon:"🚇",color:"#3a6ea5",items:[
["la maison","la mɛ.zɔ̃","房子 / 家","fángzi","🏠"],["l'école","le.kɔl","学校","xuéxiào","🏫"],["la gare","la gaʁ","火车站","huǒchēzhàn","🚉"],["l'hôpital","lo.pi.tal","医院","yīyuàn","🏥"],
["le magasin","lə ma.ga.zɛ̃","商店","shāngdiàn","🏪"],["le restaurant","lə ʁɛs.to.ʁɑ̃","餐厅","cāntīng","🍽️"],["la rue","la ʁy","街道","jiēdào","🛣️"],["la ville","la vil","城市","chéngshì","🏙️"],
["le métro","lə me.tʁo","地铁","dìtiě","🚇"],["la voiture","la vwa.tyʁ","汽车","qìchē","🚗"],["le bus","lə bys","公交车","gōngjiāochē","🚌"],["le train","lə tʁɛ̃","火车","huǒchē","🚆"],["l'avion","la.vjɔ̃","飞机","fēijī","✈️"]]},
{id:"taxi",name:"Taxi & hôtel · 出租车和酒店",icon:"🚕",color:"#fb8500",items:[
["le taxi","lə tak.si","出租车","chūzūchē","🚕"],["à gauche","a goʃ","向左","xiàng zuǒ","⬅️"],["à droite","a dʁwat","向右","xiàng yòu","➡️"],["tout droit","tu dʁwa","直走","zhí zǒu","⬆️"],["Où est… ?","u ɛ","……在哪里？","zài nǎlǐ","📍"],
["l'hôtel","lo.tɛl","酒店","jiǔdiàn","🏨"],["la chambre","la ʃɑ̃bʁ","房间","fángjiān","🛏️"],["la clé","la kle","钥匙","yàoshi","🔑"],["la valise","la va.liz","行李箱","xínglixiāng","🧳"],["le passeport","lə pas.pɔʁ","护照","hùzhào","🛂"]]},
{id:"temps",name:"Le temps · 时间",icon:"📅",color:"#06a77d",items:[
["lundi","lœ̃.di","星期一","xīngqī yī","1️⃣"],["mardi","maʁ.di","星期二","xīngqī èr","2️⃣"],["mercredi","mɛʁ.kʁə.di","星期三","xīngqī sān","3️⃣"],["jeudi","ʒø.di","星期四","xīngqī sì","4️⃣"],
["vendredi","vɑ̃.dʁə.di","星期五","xīngqī wǔ","5️⃣"],["samedi","sam.di","星期六","xīngqī liù","6️⃣"],["dimanche","di.mɑ̃ʃ","星期日","xīngqī rì","7️⃣"],["aujourd'hui","o.ʒuʁ.dɥi","今天","jīntiān","📍"],
["demain","də.mɛ̃","明天","míngtiān","⏭️"],["hier","jɛʁ","昨天","zuótiān","⏮️"],["le matin","lə ma.tɛ̃","早上","zǎoshang","🌅"],["le soir","lə swaʁ","晚上","wǎnshang","🌆"],["l'heure","lœʁ","小时 / 点钟","xiǎoshí","🕐"],["le jour","lə ʒuʁ","天 / 白天","tiān","☀️"]]},
{id:"meteo",name:"La météo · 天气",icon:"⛅",color:"#4895ef",items:[
["le soleil","lə sɔ.lɛj","太阳","tàiyáng","☀️"],["la pluie","la plɥi","雨","yǔ","🌧️"],["la neige","la nɛʒ","雪","xuě","❄️"],["le vent","lə vɑ̃","风","fēng","💨"],["le nuage","lə nɥaʒ","云","yún","☁️"],["Il fait beau","il fɛ bo","天气好","tiānqì hǎo","🌤️"],["Il fait froid","il fɛ fʁwa","天气冷","tiānqì lěng","🥶"],["Il pleut","il plø","下雨","xiàyǔ","☔"]]},
{id:"animaux",name:"Animaux · 动物",icon:"🐾",color:"#8338ec",items:[
["le chien","lə ʃjɛ̃","狗","gǒu","🐶"],["le chat","lə ʃa","猫","māo","🐱"],["l'oiseau","lwa.zo","鸟","niǎo","🐦"],["le cheval","lə ʃə.val","马","mǎ","🐴"],["la vache","la vaʃ","牛","niú","🐄"],["le cochon","lə kɔ.ʃɔ̃","猪","zhū","🐷"],["le poisson","lə pwa.sɔ̃","鱼","yú","🐟"],["le panda","lə pɑ̃.da","熊猫","xióngmāo","🐼"]]},
{id:"loisirs",name:"Loisirs · 爱好",icon:"⚽",color:"#06d6a0",items:[
["la musique","la my.zik","音乐","yīnyuè","🎵"],["le sport","lə spɔʁ","运动","yùndòng","🏃"],["le football","lə fut.bol","足球","zúqiú","⚽"],["le cinéma","lə si.ne.ma","电影院","diànyǐngyuàn","🎬"],["le livre","lə livʁ","书","shū","📚"],["voyager","vwa.ja.ʒe","旅行","lǚxíng","🌍"],["nager","na.ʒe","游泳","yóuyǒng","🏊"],["le téléphone","lə te.le.fɔn","手机 / 电话","shǒujī","📱"]]}
];
const STEPS=[["Premiers mots · 入门词汇",["salut","presente","nombres"]],
["Les verbes les plus utiles · 最常用动词",["etre","conj","verbes","m:phr"]],
["Ma vie · 我的生活",["famille","corps","couleurs","vetements","animaux","loisirs"]],
["Manger & faire les courses · 吃饭与购物",["manger","resto","courses"]],
["Voyager · 旅行",["lieux","taxi","temps","meteo"]],
["Santé · 健康",["docteur"]]];
// phrases : mots séparés par "/", prononciation, 中文
const PH=[
["Je/m'appelle/Marie","ʒə ma.pɛl ma.ʁi","我叫玛丽。"],["Je/suis/chinois","ʒə sɥi ʃi.nwa","我是中国人。"],["Comment/vas/tu","kɔ.mɑ̃ va ty","你好吗？"],
["J'habite/en/France","ʒa.bit ɑ̃ fʁɑ̃s","我住在法国。"],["Je/voudrais/un/café","ʒə vu.dʁɛ œ̃ ka.fe","我想要一杯咖啡。"],["Il/est/mon/ami","il ɛ mɔ̃ na.mi","他是我的朋友。"],
["Elle/mange/du/pain","ɛl mɑ̃ʒ dy pɛ̃","她吃面包。"],["Nous/allons/à/l'école","nu za.lɔ̃ a le.kɔl","我们去学校。"],["Tu/as/un/frère","ty a œ̃ fʁɛʁ","你有一个哥哥/弟弟。"],
["Où/est/la/gare","u ɛ la gaʁ","火车站在哪里？"],["Je/ne/parle/pas/chinois","ʒə nə paʁl pa ʃi.nwa","我不会说中文。"],["Aujourd'hui/il/fait/froid","o.ʒuʁ.dɥi il fɛ fʁwa","今天很冷。"],
["Je/prends/le/métro","ʒə pʁɑ̃ lə me.tʁo","我坐地铁。"],["Demain/je/travaille","də.mɛ̃ ʒə tʁa.vaj","明天我工作。"],["La/maison/est/grande","la mɛ.zɔ̃ ɛ gʁɑ̃d","房子很大。"],
["Je/veux/apprendre/le/français","ʒə vø a.pʁɑ̃dʁ lə fʁɑ̃.sɛ","我想学法语。"],["Vous/pouvez/répéter","vu pu.ve ʁe.pe.te","您可以重复一遍吗？"],["Je/ne/comprends/pas","ʒə nə kɔ̃.pʁɑ̃ pa","我不明白。"],
["Nous/avons/deux/enfants","nu za.vɔ̃ dø zɑ̃.fɑ̃","我们有两个孩子。"],["L'addition/s'il/vous/plaît","la.di.sjɔ̃ sil vu plɛ","请结账。"],
["J'ai/mal/à/la/tête","ʒe mal a la tɛt","我头疼。"],["Je/dois/aller/chez/le/médecin","ʒə dwa a.le ʃe lə med.sɛ̃","我必须去看医生。"],["Je/peux/payer/par/carte","ʒə pø pɛ.je paʁ kaʁt","我可以刷卡吗？"],
["Je/veux/aller/à/la/gare","ʒə vø a.le a la gaʁ","我想去火车站。"],["Tournez/à/gauche","tuʁ.ne a goʃ","向左转。"]];
