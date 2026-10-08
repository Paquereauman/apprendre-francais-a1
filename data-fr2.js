// Chapitres inspirés du cours FLE A1 (affiches et fiches de classe). Format d'une ligne : français | API | 中文 | pinyin | emoji
const L=s=>s.trim().split("\n").map(l=>l.split("|").map(x=>x.trim()));
const addCat=(id,name,icon,color,s)=>CATS.push({id,name,icon,color,items:L(s)});
const ext=(id,s)=>{const c=CATS.find(x=>x.id===id),have=new Set(c.items.map(i=>i[0]));L(s).forEach(i=>{if(!have.has(i[0]))c.items.push(i)})};
const setItems=(id,s,name,icon)=>{const c=CATS.find(x=>x.id===id);c.items=L(s);if(name)c.name=name;if(icon)c.icon=icon};

/* ---- 1. Classe ---- */
addCat("classe2","Phrases de la classe · 课堂用语","💬","#d62828",`
Répétez après moi|ʁe.pe.te a.pʁɛ mwa|请跟我重复|qǐng gēn wǒ chóngfù|🔁
Pouvez-vous répéter ?|pu.ve vu ʁe.pe.te|您可以重复一遍吗？|nín kěyǐ chóngfù yíbiàn ma|🙋
Comment dit-on… en français ?|kɔ.mɑ̃ di.tɔ̃ ɑ̃ fʁɑ̃.sɛ|……用法语怎么说？|… yòng Fǎyǔ zěnme shuō|❓
Pouvez-vous traduire cette phrase ?|pu.ve vu tʁa.dɥiʁ sɛt fʁɑz|您可以翻译这个句子吗？|nín kěyǐ fānyì zhège jùzi ma|🔤
Quelle est la traduction de… ?|kɛl ɛ la tʁa.dyk.sjɔ̃ də|……的翻译是什么？|… de fānyì shì shénme|📖
Essayez de le dire en français|e.sɛ.je də lə diʁ ɑ̃ fʁɑ̃.sɛ|试着用法语说|shìzhe yòng Fǎyǔ shuō|🗣️
Je ne comprends pas|ʒə nə kɔ̃.pʁɑ̃ pa|我不明白|wǒ bù míngbai|🤷
Plus lentement, s'il vous plaît|ply lɑ̃t.mɑ̃ sil vu plɛ|请说慢一点|qǐng shuō màn yìdiǎn|🐢
J'ai une question|ʒe yn kɛs.tjɔ̃|我有一个问题|wǒ yǒu yí gè wèntí|✋
Le livre|lə livʁ|书|shū|📚
Le cahier|lə ka.je|笔记本|bǐjìběn|📓
Le stylo|lə sti.lo|钢笔 / 笔|bǐ|🖊️
Le crayon|lə kʁɛ.jɔ̃|铅笔|qiānbǐ|✏️
La gomme|la gɔm|橡皮|xiàngpí|🧽
La règle|la ʁɛgl|尺子|chǐzi|📏
Le tableau|lə ta.blo|黑板|hēibǎn|🧑‍🏫
La classe|la klɑs|教室 / 班级|jiàoshì|🏫
L'exercice|lɛɡ.zɛʁ.sis|练习|liànxí|📝`);

/* ---- 2. Salutations, présentation, nombres ---- */
ext("salut",`
Bonjour, Mademoiselle|bɔ̃.ʒuʁ mad.mwa.zɛl|你好，小姐|nǐ hǎo, xiǎojiě|👩
Comment allez-vous ?|kɔ.mɑ̃ ta.le vu|您好吗？（礼貌）|nín hǎo ma|🎩
Comment vas-tu ?|kɔ.mɑ̃ va ty|你好吗？（随意）|nǐ hǎo ma|🙂
Très bien, merci, et vous ?|tʁɛ bjɛ̃ mɛʁ.si e vu|很好，谢谢，您呢？|hěn hǎo, xièxie, nín ne|😄
Pas mal, merci|pa mal mɛʁ.si|还不错，谢谢|hái búcuò, xièxie|🙂
Comme ci, comme ça|kɔm si kɔm sa|马马虎虎|mǎmǎhǔhǔ|😐
À bientôt|a bjɛ̃.to|回头见|huítóu jiàn|👋
Ça va mal|sa va mal|我不好|wǒ bù hǎo|😞`);
ext("presente",`
Comment vous appelez-vous ?|kɔ.mɑ̃ vu za.pə.le vu|您叫什么名字？|nín jiào shénme míngzi|🏷️
D'où viens-tu ?|du vjɛ̃ ty|你从哪里来？|nǐ cóng nǎlǐ lái|🗺️
Je viens de Chine|ʒə vjɛ̃ də ʃin|我来自中国|wǒ láizì Zhōngguó|🇨🇳
Quelle est ta nationalité ?|kɛl ɛ ta na.sjɔ.na.li.te|你的国籍是什么？|nǐ de guójí shì shénme|🛂
Je suis chinois(e)|ʒə sɥi ʃi.nwa|我是中国人|wǒ shì Zhōngguórén|🏮
J'ai vingt-cinq ans|ʒe vɛ̃.sɛ̃k ɑ̃|我二十五岁|wǒ èrshíwǔ suì|🎂`);

/* ---- 3. Météo & saisons, jours ---- */
setItems("meteo",`
le printemps|lə pʁɛ̃.tɑ̃|春天|chūntiān|🌸
l'été|le.te|夏天|xiàtiān|☀️
l'automne|lo.tɔn|秋天|qiūtiān|🍂
l'hiver|li.vɛʁ|冬天|dōngtiān|❄️
Quel temps fait-il ?|kɛl tɑ̃ fɛ.til|天气怎么样？|tiānqì zěnmeyàng|🌡️
Il fait chaud|il fɛ ʃo|很热|hěn rè|🥵
Il fait froid|il fɛ fʁwa|很冷|hěn lěng|🥶
Il fait doux|il fɛ du|温和|wēnhé|🌤️
Il fait frais|il fɛ fʁɛ|凉爽|liángshuǎng|🍃
Il fait beau|il fɛ bo|天气好|tiānqì hǎo|😎
Il pleut|il plø|下雨|xiàyǔ|🌧️
Il neige|il nɛʒ|下雪|xiàxuě|☃️
Il y a du vent|i li a dy vɑ̃|有风|yǒu fēng|💨
Il y a du soleil|i li a dy sɔ.lɛj|有太阳|yǒu tàiyáng|☀️
Il y a de l'orage|i li a də lɔ.ʁaʒ|有雷雨|yǒu léiyǔ|⛈️
la température|la tɑ̃.pe.ʁa.tyʁ|温度|wēndù|🌡️
vingt degrés|vɛ̃ də.gʁe|二十度|èrshí dù|🌡️
moins cinq degrés|mwɛ̃ sɛ̃k də.gʁe|零下五度|língxià wǔ dù|🧊`);

/* ---- 4. Vêtements & couleurs ---- */
setItems("vetements",`
un tee-shirt|œ̃ ti.ʃœʁt|T恤|T xù|👕
un pantalon|œ̃ pɑ̃.ta.lɔ̃|裤子|kùzi|👖
une robe|yn ʁɔb|连衣裙|liányīqún|👗
une jupe|yn ʒyp|裙子|qúnzi|🩳
un pull|œ̃ pyl|毛衣|máoyī|🧶
un manteau|œ̃ mɑ̃.to|外套 / 大衣|wàitào|🧥
une chemise|yn ʃə.miz|衬衫|chènshān|👔
un chapeau|œ̃ ʃa.po|帽子|màozi|🎩
des chaussettes|de ʃo.sɛt|袜子|wàzi|🧦
des chaussures|de ʃo.syʁ|鞋子|xiézi|👟
un bonnet|œ̃ bɔ.nɛ|针织帽|zhēnzhī mào|🧢
une écharpe|yn e.ʃaʁp|围巾|wéijīn|🧣
Il porte quoi ?|il pɔʁt kwa|他穿什么？|tā chuān shénme|❓
Il porte un t-shirt rouge|il pɔʁt œ̃ ti.ʃœʁt ʁuʒ|他穿一件红色的T恤|tā chuān yí jiàn hóngsè de T xù|👕
la taille|la taj|尺码（衣服）|chǐmǎ|📏
la pointure|la pwɛ̃.tyʁ|鞋码|xiémǎ|👞
Je vais essayer ce t-shirt|ʒə vɛ ze.sɛ.je sə ti.ʃœʁt|我要试穿这件T恤|wǒ yào shìchuān zhè jiàn T xù|🪞
Avez-vous une taille plus grande ?|a.ve vu yn taj ply gʁɑ̃d|您有大一点的尺码吗？|nín yǒu dà yìdiǎn de chǐmǎ ma|🔍
neuf|nœf|新的|xīn de|🆕
d'occasion|dɔ.ka.zjɔ̃|二手的|èrshǒu de|♻️`,"Vêtements · 衣服");
setItems("couleurs",`
blanc|blɑ̃|白色|báisè|⚪
noir|nwaʁ|黑色|hēisè|⚫
rouge|ʁuʒ|红色|hóngsè|🔴
bleu|blø|蓝色|lánsè|🔵
vert|vɛʁ|绿色|lǜsè|🟢
jaune|ʒon|黄色|huángsè|🟡
marron|ma.ʁɔ̃|棕色|zōngsè|🟤
rose|ʁoz|粉色|fěnsè|🌸
orange|ɔ.ʁɑ̃ʒ|橙色|chéngsè|🟠
violet|vjɔ.lɛ|紫色|zǐsè|🟣
gris|gʁi|灰色|huīsè|🌫️
Quelle est la couleur ?|kɛl ɛ la ku.lœʁ|是什么颜色？|shì shénme yánsè|🎨
C'est bleu|sɛ blø|是蓝色的|shì lánsè de|🔵`,"Couleurs · 颜色","🎨");

/* ---- 5. Description physique ---- */
addCat("physique","La description physique · 外貌描写","🧑","#f72585",`
vieux / vieille|vjø / vjɛj|老的|lǎo|👴
jeune|ʒœn|年轻的|niánqīng|🧑
grand(e)|gʁɑ̃(d)|高的|gāo|🧍
moyen(ne)|mwa.jɛ̃ / mwa.jɛn|中等的|zhōngděng|🧍
petit(e)|pə.ti(t)|矮的|ǎi|🧒
beau / belle|bo / bɛl|漂亮的|piàoliang|😍
laid(e)|lɛ(d)|丑的|chǒu|😖
gros(se)|gʁo(s)|胖的|pàng|🧍
mince|mɛ̃s|瘦的|shòu|🕴️
une moustache|yn mus.taʃ|小胡子|xiǎo húzi|🥸
une barbe|yn baʁb|大胡子|dà húzi|🧔
des lunettes|de ly.nɛt|眼镜|yǎnjìng|🤓
Il est grand|i lɛ gʁɑ̃|他很高|tā hěn gāo|🧍
Elle a les yeux bleus|ɛl a le zjø blø|她有蓝色的眼睛|tā yǒu lánsè de yǎnjing|👁️`);
addCat("cheveux","Cheveux & yeux · 头发和眼睛","💇","#b5179e",`
les cheveux|le ʃə.vø|头发|tóufa|💇
longs|lɔ̃|长的|cháng|👩
courts|kuʁ|短的|duǎn|👱
lisses / raides|lis / ʁɛd|直的|zhí|🧑
frisés|fʁi.ze|卷的（小卷）|juǎn|🧑‍🦱
bouclés|bu.kle|卷的（大卷）|juǎn|👩‍🦱
noirs|nwaʁ|黑色的|hēi|⚫
bruns|bʁœ̃|棕色的（头发）|zōng|🟤
blonds|blɔ̃|金色的|jīn|🟡
roux|ʁu|红色的（头发）|hóng|🟠
gris|gʁi|灰色的|huī|🌫️
les yeux|le zjø|眼睛|yǎnjing|👀
marron|ma.ʁɔ̃|棕色|zōngsè|🟤
bleus|blø|蓝色的|lán|🔵
verts|vɛʁ|绿色的|lǜ|🟢`);

/* ---- 6. Famille, animaux, possessifs ---- */
addCat("possessifs","Mon, ma, mes… · 物主形容词","🙋","#9b5de5",`
mon frère|mɔ̃ fʁɛʁ|我的哥哥/弟弟|wǒ de gēge|👦
ma sœur|ma sœʁ|我的姐姐/妹妹|wǒ de jiějie|👧
mes amis|me za.mi|我的朋友们|wǒ de péngyoumen|🧑‍🤝‍🧑
ton père|tɔ̃ pɛʁ|你的爸爸|nǐ de bàba|👨
ta mère|ta mɛʁ|你的妈妈|nǐ de māma|👩
tes enfants|te zɑ̃.fɑ̃|你的孩子们|nǐ de háizimen|🧒
son livre|sɔ̃ livʁ|他/她的书|tā de shū|📕
sa voiture|sa vwa.tyʁ|他/她的车|tā de chē|🚗
ses clés|se kle|他/她的钥匙|tā de yàoshi|🔑
notre maison|nɔ.tʁə mɛ.zɔ̃|我们的房子|wǒmen de fángzi|🏠
nos amis|no za.mi|我们的朋友|wǒmen de péngyou|👥
votre ordinateur|vɔ.tʁə ɔʁ.di.na.tœʁ|您的电脑|nín de diànnǎo|💻
vos chaussures|vo ʃo.syʁ|您的鞋子|nín de xiézi|👟
leur chat|lœʁ ʃa|他们的猫|tāmen de māo|🐱
leurs enfants|lœʁ zɑ̃.fɑ̃|他们的孩子|tāmen de háizi|🧒`);
setItems("animaux",`
le chien|lə ʃjɛ̃|狗|gǒu|🐶
le chat|lə ʃa|猫|māo|🐱
le poisson|lə pwa.sɔ̃|鱼|yú|🐟
le lapin|lə la.pɛ̃|兔子|tùzi|🐰
le cochon|lə kɔ.ʃɔ̃|猪|zhū|🐷
le mouton|lə mu.tɔ̃|羊|yáng|🐑
la poule|la pul|鸡|jī|🐔
le canard|lə ka.naʁ|鸭|yā|🦆
la vache|la vaʃ|牛|niú|🐄
le cheval|lə ʃə.val|马|mǎ|🐴
l'éléphant|le.le.fɑ̃|大象|dàxiàng|🐘
la girafe|la ʒi.ʁaf|长颈鹿|chángjǐnglù|🦒
le panda|lə pɑ̃.da|熊猫|xióngmāo|🐼
le lion|lə ljɔ̃|狮子|shīzi|🦁
la grenouille|la gʁə.nuj|青蛙|qīngwā|🐸
le crabe|lə kʁab|螃蟹|pángxiè|🦀`,"Les animaux · 动物");

/* ---- 7. La chambre & la maison ---- */
addCat("chambre","Dans la chambre · 在卧室里","🛏️","#4895ef",`
la chambre|la ʃɑ̃bʁ|卧室|wòshì|🛏️
le lit|lə li|床|chuáng|🛏️
l'armoire|laʁ.mwaʁ|衣柜|yīguì|🚪
le miroir|lə mi.ʁwaʁ|镜子|jìngzi|🪞
la lampe|la lɑ̃p|灯|dēng|💡
la fenêtre|la fə.nɛtʁ|窗户|chuānghu|🪟
le tableau|lə ta.blo|画|huà|🖼️
le coussin|lə ku.sɛ̃|靠垫|kàodiàn|🛋️
le tapis|lə ta.pi|地毯|dìtǎn|🟫
le bureau|lə by.ʁo|书桌|shūzhuō|🖥️
la chaise|la ʃɛz|椅子|yǐzi|💺
l'ordinateur portable|lɔʁ.di.na.tœʁ pɔʁ.tabl|笔记本电脑|bǐjìběn diànnǎo|💻
l'étagère|le.ta.ʒɛʁ|架子|jiàzi|📚
le livre|lə livʁ|书|shū|📘
le doudou|lə du.du|毛绒玩具|máoróng wánjù|🧸
Il y a un lit|i li a œ̃ li|有一张床|yǒu yì zhāng chuáng|👉
Où est la lampe ?|u ɛ la lɑ̃p|灯在哪里？|dēng zài nǎlǐ|❓`);

/* ---- 8. Nourriture, cuisine, restaurant, courses ---- */
setItems("fruits",`
la tomate|la tɔ.mat|西红柿|xīhóngshì|🍅
la carotte|la ka.ʁɔt|胡萝卜|húluóbo|🥕
la pomme de terre|la pɔm də tɛʁ|土豆|tǔdòu|🥔
le concombre|lə kɔ̃.kɔ̃bʁ|黄瓜|huángguā|🥒
la courgette|la kuʁ.ʒɛt|西葫芦|xīhúlu|🥬
l'ail|laj|大蒜|dàsuàn|🧄
le chou|lə ʃu|卷心菜|juǎnxīncài|🥬
l'avocat|la.vɔ.ka|牛油果|niúyóuguǒ|🥑
l'oignon|lɔ.ɲɔ̃|洋葱|yángcōng|🧅
le poivron|lə pwa.vʁɔ̃|甜椒|tiánjiāo|🫑
la fraise|la fʁɛz|草莓|cǎoméi|🍓
la cerise|la sə.ʁiz|樱桃|yīngtáo|🍒
la poire|la pwaʁ|梨|lí|🍐
la banane|la ba.nan|香蕉|xiāngjiāo|🍌
le citron|lə si.tʁɔ̃|柠檬|níngméng|🍋
la pomme|la pɔm|苹果|píngguǒ|🍎`,"Fruits & légumes · 水果和蔬菜");
setItems("viandes",`
les œufs|le zø|鸡蛋|jīdàn|🥚
le bœuf|lə bœf|牛肉|niúròu|🥩
le porc|lə pɔʁ|猪肉|zhūròu|🥓
le poisson|lə pwa.sɔ̃|鱼|yú|🐟
le poulet|lə pu.lɛ|鸡肉|jīròu|🍗
le fromage|lə fʁɔ.maʒ|奶酪|nǎilào|🧀
le lait|lə lɛ|牛奶|niúnǎi|🥛
le yaourt|lə ja.uʁt|酸奶|suānnǎi|🥣
le riz|lə ʁi|米饭|mǐfàn|🍚
les pâtes|le pat|意大利面|yìdàlìmiàn|🍝
les céréales|le se.ʁe.al|谷物|gǔwù|🥣
le jambon|lə ʒɑ̃.bɔ̃|火腿|huǒtuǐ|🍖
le beurre|lə bœʁ|黄油|huángyóu|🧈
le sucre|lə sykʁ|糖|táng|🍬
le sel|lə sɛl|盐|yán|🧂
la soupe|la sup|汤|tāng|🍲`,"Viandes, produits laitiers & céréales · 肉、乳制品和谷物");
addCat("cuisine","En cuisine · 在厨房","🍳","#fb8500",`
une boîte de sardines|yn bwat də saʁ.din|一盒沙丁鱼|yì hé shādīngyú|🥫
une bouteille de lait|yn bu.tɛj də lɛ|一瓶牛奶|yì píng niúnǎi|🍼
un verre d'eau|œ̃ vɛʁ do|一杯水|yì bēi shuǐ|🥛
un kilo de farine|œ̃ ki.lo də fa.ʁin|一公斤面粉|yì gōngjīn miànfěn|⚖️
un litre de lait|œ̃ litʁ də lɛ|一升牛奶|yì shēng niúnǎi|🥛
un paquet de biscuits|œ̃ pa.kɛ də bis.kɥi|一包饼干|yì bāo bǐnggān|🍪
une part de pizza|yn paʁ də pid.za|一块披萨|yí kuài pīsà|🍕
beaucoup de sucre|bo.ku də sykʁ|很多糖|hěn duō táng|🍬
un peu de pâtes|œ̃ pø də pat|一点意面|yìdiǎn yìmiàn|🍝
laver|la.ve|洗|xǐ|🚿
éplucher|e.ply.ʃe|削皮|xiāopí|🥕
couper|ku.pe|切|qiē|🔪
ajouter|a.ʒu.te|加入|jiārù|➕
mélanger|me.lɑ̃.ʒe|搅拌|jiǎobàn|🥣
cuire|kɥiʁ|煮 / 烹饪|zhǔ / pēngrèn|🍳`);
setItems("resto",`
l'entrée|lɑ̃.tʁe|前菜|qiáncài|🥗
le plat principal|lə pla pʁɛ̃.si.pal|主菜|zhǔcài|🍝
le dessert|lə de.sɛʁ|甜点|tiándiǎn|🍮
la carte|la kaʁt|菜单|càidān|📜
la boisson|la bwa.sɔ̃|饮料|yǐnliào|🥤
le serveur / la serveuse|lə sɛʁ.vœʁ / la sɛʁ.vøz|服务员|fúwùyuán|🤵
une assiette|yn a.sjɛt|盘子|pánzi|🍽️
une bouteille d'eau|yn bu.tɛj do|一瓶水|yì píng shuǐ|💧
un verre|œ̃ vɛʁ|杯子|bēizi|🥂
une cuillère|yn kɥi.jɛʁ|勺子|sháozi|🥄
une fourchette|yn fuʁ.ʃɛt|叉子|chāzi|🍴
un couteau|œ̃ ku.to|刀|dāozi|🔪
Vous avez une table pour deux ?|vu za.ve yn tabl puʁ dø|有两人的桌子吗？|yǒu liǎng gèrén de zhuōzi ma|🪑
Je voudrais…|ʒə vu.dʁɛ|我想要……|wǒ xiǎng yào|🙏
C'est épicé ?|sɛ te.pi.se|辣吗？|là ma|🌶️
Sans gluten / sans lactose|sɑ̃ glu.tɛn / sɑ̃ lak.toz|无麸质 / 无乳糖|wú fūzhì / wú rǔtáng|🚫
L'addition, s'il vous plaît|la.di.sjɔ̃ sil vu plɛ|请给我账单|qǐng gěi wǒ zhàngdān|🧾`,"Au restaurant · 餐厅");
ext("courses",`
le caddie|lə ka.di|购物车|gòuwùchē|🛒
le vendeur / la vendeuse|lə vɑ̃.dœʁ / la vɑ̃.døz|售货员|shòuhuòyuán|🧑‍💼
la liste de courses|la list də kuʁs|购物清单|gòuwù qīngdān|📝`);
setItems("commerces",`
la boucherie|la bu.ʃə.ʁi|肉店|ròudiàn|🥩
la boulangerie|la bu.lɑ̃ʒ.ʁi|面包店|miànbāodiàn|🥖
la fromagerie|la fʁɔ.maʒ.ʁi|奶酪店|nǎilàodiàn|🧀
le marché|lə maʁ.ʃe|市场|shìchǎng|🧺
le supermarché|lə sy.pɛʁ.maʁ.ʃe|超市|chāoshì|🛒
la poissonnerie|la pwa.sɔn.ʁi|鱼店|yúdiàn|🐟
la librairie|la li.bʁɛ.ʁi|书店|shūdiàn|📚
le restaurant|lə ʁɛs.to.ʁɑ̃|餐厅|cāntīng|🍽️
le fleuriste|lə flœ.ʁist|花店|huādiàn|💐
la pharmacie|la faʁ.ma.si|药店|yàodiàn|💊
la poste|la pɔst|邮局|yóujú|📮
la banque|la bɑ̃k|银行|yínháng|🏦
le coiffeur|lə kwa.fœʁ|理发店 / 理发师|lǐfàshī|💇
le magasin de vêtements|lə ma.ga.zɛ̃ də vɛt.mɑ̃|服装店|fúzhuāngdiàn|👗
le bar|lə baʁ|酒吧|jiǔbā|🍺
Je vais à la boulangerie|ʒə vɛ za la bu.lɑ̃ʒ.ʁi|我去面包店|wǒ qù miànbāodiàn|🚶
Je vais chez le boulanger|ʒə vɛ ʃe lə bu.lɑ̃.ʒe|我去面包师那里|wǒ qù miànbāoshī nàlǐ|🥖`,"Les commerces · 商店");

/* ---- 9. Santé ---- */
setItems("corps",`
la tête|la tɛt|头|tóu|🧠
le cou|lə ku|脖子|bózi|🦒
la gorge|la gɔʁʒ|喉咙|hóulóng|😮
le ventre|lə vɑ̃tʁ|肚子|dùzi|🤰
l'épaule|le.pol|肩膀|jiānbǎng|💪
le coude|lə kud|手肘|shǒuzhǒu|💪
le bras|lə bʁa|手臂|shǒubì|💪
la main|la mɛ̃|手|shǒu|✋
le doigt|lə dwa|手指|shǒuzhǐ|☝️
le genou|lə ʒə.nu|膝盖|xīgài|🦵
la jambe|la ʒɑ̃b|腿|tuǐ|🦵
le dos|lə do|背|bèi|🔙
la hanche|la ɑ̃ʃ|臀部 / 髋|kuān|🕺
la cheville|la ʃə.vij|脚踝|jiǎohuái|🦶
le pied|lə pje|脚|jiǎo|🦶`,"Le corps · 身体");
setItems("docteur",`
J'ai mal à la tête|ʒe mal a la tɛt|我头疼|wǒ tóu téng|🤕
J'ai mal au ventre|ʒe mal o vɑ̃tʁ|我肚子疼|wǒ dùzi téng|🤢
Je me suis cassé la jambe|ʒə mə sɥi ka.se la ʒɑ̃b|我腿骨折了|wǒ gǔzhé le|🦵
J'ai une migraine|ʒe yn mi.gʁɛn|我偏头痛|wǒ piāntóutòng|😣
J'ai la fièvre|ʒe la fjɛvʁ|我发烧了|wǒ fāshāo le|🤒
Je vomis|ʒə vɔ.mi|我在吐|wǒ zài tù|🤮
Je tousse|ʒə tus|我咳嗽|wǒ késou|😷
J'ai un rhume|ʒe œ̃ ʁym|我感冒了|wǒ gǎnmào le|🤧
Je me suis coupé le doigt|ʒə mə sɥi ku.pe lə dwa|我割到手指了|wǒ gē dào shǒuzhǐ le|🩹
Je suis fatigué(e)|ʒə sɥi fa.ti.ge|我很累|wǒ hěn lèi|😴
Où avez-vous mal ?|u a.ve vu mal|您哪里疼？|nín nǎlǐ téng|🩺
un rendez-vous|œ̃ ʁɑ̃.de.vu|预约|yùyuē|📅
Au secours !|o sə.kuʁ|救命！|jiùmìng|🆘`,"Chez le docteur · 看医生");
addCat("medic","Médicaments & métiers de la santé · 药品与医疗职业","💊","#2bb673",`
le médicament|lə me.di.ka.mɑ̃|药|yào|💊
le sirop|lə si.ʁo|糖浆|tángjiāng|🧴
le paracétamol|lə pa.ʁa.se.ta.mɔl|对乙酰氨基酚|duìyǐxiān'ānjīfēn|💊
la vitamine C|la vi.ta.min se|维生素C|wéishēngsù C|🍊
le médecin|lə med.sɛ̃|医生|yīshēng|👨‍⚕️
l'infirmier / l'infirmière|lɛ̃.fiʁ.mje / lɛ̃.fiʁ.mjɛʁ|护士|hùshì|👩‍⚕️
le dentiste|lə dɑ̃.tist|牙医|yáyī|🦷
le pharmacien / la pharmacienne|lə faʁ.ma.sjɛ̃ / la faʁ.ma.sjɛn|药剂师|yàojìshī|🧑‍🔬
la pharmacie|la faʁ.ma.si|药店|yàodiàn|🏪
l'hôpital|lo.pi.tal|医院|yīyuàn|🏥
chez le médecin|ʃe lə med.sɛ̃|在医生那里|zài yīshēng nàlǐ|🩺
les urgences|le zyʁ.ʒɑ̃s|急诊|jízhěn|🚑`);

/* ---- 10. Sports ---- */
setItems("sports",`
le football|lə fut.bol|足球|zúqiú|⚽
le basketball|lə bas.kɛt.bol|篮球|lánqiú|🏀
le ping-pong|lə piŋ.pɔ̃g|乒乓球|pīngpāngqiú|🏓
le volley-ball|lə vɔ.lɛ.bol|排球|páiqiú|🏐
la natation|la na.ta.sjɔ̃|游泳（运动）|yóuyǒng|🏊
nager|na.ʒe|游泳|yóu|🏊
le vélo|lə ve.lo|骑自行车|qí zìxíngchē|🚴
le yoga|lə jo.ga|瑜伽|yújiā|🧘
le tennis|lə te.nis|网球|wǎngqiú|🎾
la musculation|la mys.ky.la.sjɔ̃|健身|jiànshēn|🏋️
la course|la kuʁs|跑步|pǎobù|🏃
courir|ku.ʁiʁ|跑|pǎo|🏃
faire du sport|fɛʁ dy spɔʁ|做运动|zuò yùndòng|💪
Je fais du vélo|ʒə fɛ dy ve.lo|我骑自行车|wǒ qí zìxíngchē|🚴`,"Faire du sport · 做运动");

/* ---- 11. En ville : lieux, directions, transports ---- */
addCat("ville","Les éléments de la ville · 城市里的事物","🏙️","#3a6ea5",`
le parc|lə paʁk|公园|gōngyuán|🌳
le feu|lə fø|红绿灯|hónglǜdēng|🚦
les escaliers|le zɛs.ka.lje|楼梯|lóutī|🪜
le rond-point|lə ʁɔ̃.pwɛ̃|环岛|huándǎo|🔄
le banc|lə bɑ̃|长椅|chángyǐ|🪑
la fontaine|la fɔ̃.tɛn|喷泉|pēnquán|⛲
le pont|lə pɔ̃|桥|qiáo|🌉
le panneau stop|lə pa.no stɔp|停止标志|tíngzhǐ biāozhì|🛑
la rue|la ʁy|街道|jiēdào|🛣️
l'avenue|la.vny|大街|dàjiē|🏙️
l'église|le.gliz|教堂|jiàotáng|⛪
la mairie|la mɛ.ʁi|市政厅|shìzhèngtīng|🏛️
le musée|lə my.ze|博物馆|bówùguǎn|🖼️
la bibliothèque|la bi.bljɔ.tɛk|图书馆|túshūguǎn|📚
la police|la pɔ.lis|警察局|jǐngchájú|👮
l'aéroport|la.e.ʁɔ.pɔʁ|机场|jīchǎng|✈️`);
addCat("directions","Se repérer · 问路和方向","🧭","#2a9d8f",`
à gauche|a goʃ|左边|zuǒbiān|⬅️
à droite|a dʁwat|右边|yòubiān|➡️
tout droit|tu dʁwa|直走|zhí zǒu|⬆️
devant|də.vɑ̃|前面|qiánmiàn|⏫
derrière|dɛ.ʁjɛʁ|后面|hòumiàn|⏬
à côté de|a ko.te də|旁边|pángbiān|↔️
en face de|ɑ̃ fas də|对面|duìmiàn|↕️
Où est… ?|u ɛ|……在哪儿？|… zài nǎr|❓
Comment aller à… ?|kɔ.mɑ̃ ta.le a|怎么去……？|zěnme qù|🗺️
Je suis perdu(e)|ʒə sɥi pɛʁ.dy|我迷路了|wǒ mílù le|😵
Je cherche le parc|ʒə ʃɛʁʃ lə paʁk|我在找公园|wǒ zài zhǎo gōngyuán|🔍
aller|a.le|去|qù|🚶
tourner|tuʁ.ne|转|zhuǎn|↪️
continuer|kɔ̃.ti.nɥe|继续|jìxù|⏩
traverser|tʁa.vɛʁ.se|穿过|chuānguò|🚸
suivre|sɥivʁ|沿着走|yánzhe zǒu|👣
souvent|su.vɑ̃|经常|jīngcháng|🔁
parfois|paʁ.fwa|有时|yǒushí|🔂
rarement|ʁaʁ.mɑ̃|很少|hěn shǎo|🔅
jamais|ʒa.mɛ|从不|cóngbù|🚫`);
setItems("taxi",`
la voiture|la vwa.tyʁ|汽车|qìchē|🚗
la moto|la mɔ.to|摩托车|mótuōchē|🏍️
le scooter|lə sku.tœʁ|踏板车|tàbǎnchē|🛵
le vélo|lə ve.lo|自行车|zìxíngchē|🚲
le bus|lə bys|公交车|gōngjiāochē|🚌
le train|lə tʁɛ̃|火车|huǒchē|🚆
le métro|lə me.tʁo|地铁|dìtiě|🚇
l'hélicoptère|le.li.kɔp.tɛʁ|直升机|zhíshēngjī|🚁
l'avion|la.vjɔ̃|飞机|fēijī|✈️
le bateau|lə ba.to|船|chuán|🚢
le taxi|lə tak.si|出租车|chūzūchē|🚕
à pied|a pje|步行|bùxíng|🚶
Je prends le bus|ʒə pʁɑ̃ lə bys|我坐公交车|wǒ zuò gōngjiāochē|🚌
Je vais à l'école en bus|ʒə vɛ a le.kɔl ɑ̃ bys|我坐公交车去上学|wǒ zuò gōngjiāochē qù shàngxué|🏫`,"Les transports · 交通工具","🚌");

/* ---- 12. Vacances & voyage ---- */
setItems("vacances",`
la plage|la plaʒ|海滩|hǎitān|🏖️
la montagne|la mɔ̃.taɲ|山|shān|⛰️
la mer|la mɛʁ|大海|dàhǎi|🌊
la ville|la vil|城市|chéngshì|🏙️
la campagne|la kɑ̃.paɲ|农村|nóngcūn|🌾
la rivière|la ʁi.vjɛʁ|河|hé|🏞️
le lac|lə lak|湖|hú|🛶
la forêt|la fɔ.ʁɛ|森林|sēnlín|🌲
le village|lə vi.laʒ|村庄|cūnzhuāng|🏘️
l'hôtel|lo.tɛl|酒店|jiǔdiàn|🏨
le camping|lə kɑ̃.piŋ|露营地|lùyíngdì|⛺
la location|la lo.ka.sjɔ̃|租房|zūfáng|🏠
la chambre d'hôtes|la ʃɑ̃bʁ dot|民宿|mínsù|🛏️
la ferme|la fɛʁm|农场|nóngchǎng|🚜
la tente|la tɑ̃t|帐篷|zhàngpeng|⛺
se baigner|sə bɛ.ɲe|游泳|yóuyǒng|🏊
bronzer|bʁɔ̃.ze|晒太阳|shài tàiyáng|😎
se promener|sə pʁɔm.ne|散步|sànbù|🚶
faire de la randonnée|fɛʁ də la ʁɑ̃.dɔ.ne|徒步旅行|túbù lǚxíng|🥾
faire du surf|fɛʁ dy sœʁf|冲浪|chōnglàng|🏄
visiter|vi.zi.te|参观|cānguān|🗺️
prendre des photos|pʁɑ̃dʁ de fɔ.to|拍照|pāizhào|📸
partir|paʁ.tiʁ|出发|chūfā|🧳
voyager|vwa.ja.ʒe|旅行|lǚxíng|✈️
dormir|dɔʁ.miʁ|睡觉|shuìjiào|😴
rester|ʁɛs.te|待着|dāizhe|🛋️
préférer|pʁe.fe.ʁe|更喜欢|gèng xǐhuan|⭐
Je vais partir|ʒə vɛ paʁ.tiʁ|我要出发了|wǒ yào chūfā le|🧳
Je vais à la mer|ʒə vɛ a la mɛʁ|我去海边|wǒ qù hǎibiān|🌊
Je préfère la plage|ʒə pʁe.fɛʁ la plaʒ|我更喜欢海滩|wǒ gèng xǐhuan hǎitān|🏖️`,"Partir en vacances · 去度假","🏖️");
addCat("aeroport","À l'aéroport · 在机场","🛫","#00b4d8",`
l'enregistrement|lɑ̃.ʁə.ʒis.tʁə.mɑ̃|办理登机|bànlǐ dēngjī|🛄
le départ|lə de.paʁ|出发|chūfā|🛫
l'arrivée|la.ʁi.ve|到达|dàodá|🛬
la douane|la dwan|海关|hǎiguān|🛃
le contrôle des passeports|lə kɔ̃.tʁol de pas.pɔʁ|护照检查|hùzhào jiǎnchá|🛂
la porte d'embarquement|la pɔʁt dɑ̃.baʁ.kə.mɑ̃|登机口|dēngjīkǒu|🚪
le terminal|lə tɛʁ.mi.nal|航站楼|hángzhànlóu|🏢
le numéro de vol|lə ny.me.ʁo də vɔl|航班号|hángbānhào|🔢
le billet|lə bi.jɛ|票|piào|🎫
le passeport|lə pas.pɔʁ|护照|hùzhào|📘
la valise|la va.liz|行李箱|xínglixiāng|🧳
la clé|la kle|钥匙|yàoshi|🔑`);

/* ---- Nombres, jours, mois, heure : par étapes logiques ---- */
setItems("nombres",`
zéro|ze.ʁo|零|líng|0️⃣
un|œ̃|一|yī|1️⃣
deux|dø|二|èr|2️⃣
trois|tʁwa|三|sān|3️⃣
quatre|katʁ|四|sì|4️⃣
cinq|sɛ̃k|五|wǔ|5️⃣
six|sis|六|liù|6️⃣
sept|sɛt|七|qī|7️⃣
huit|ɥit|八|bā|8️⃣
neuf|nœf|九|jiǔ|9️⃣
dix|dis|十|shí|10`,"Les nombres de 0 à 10 · 数字0到10","🔢");
addCat("n11","Les nombres de 11 à 20 · 数字11到20","🔢","#2a9d8f",`
onze|ɔ̃z|十一|shíyī|11
douze|duz|十二|shíèr|12
treize|tʁɛz|十三|shísān|13
quatorze|ka.tɔʁz|十四|shísì|14
quinze|kɛ̃z|十五|shíwǔ|15
seize|sɛz|十六|shíliù|16
dix-sept|di.sɛt|十七|shíqī|17
dix-huit|di.zɥit|十八|shíbā|18
dix-neuf|diz.nœf|十九|shíjiǔ|19
vingt|vɛ̃|二十|èrshí|20`);
addCat("age","L'âge & les nombres de 20 à 30 · 年龄与20到30","🎂","#2a9d8f",`
vingt et un|vɛ̃.te.œ̃|二十一|èrshíyī|21
vingt-deux|vɛ̃t.dø|二十二|èrshíèr|22
vingt-trois|vɛ̃t.tʁwa|二十三|èrshísān|23
vingt-quatre|vɛ̃t.katʁ|二十四|èrshísì|24
vingt-cinq|vɛ̃t.sɛ̃k|二十五|èrshíwǔ|25
vingt-six|vɛ̃t.sis|二十六|èrshíliù|26
vingt-sept|vɛ̃t.sɛt|二十七|èrshíqī|27
vingt-huit|vɛ̃t.ɥit|二十八|èrshíbā|28
vingt-neuf|vɛ̃t.nœf|二十九|èrshíjiǔ|29
trente|tʁɑ̃t|三十|sānshí|30
Quel âge as-tu ?|kɛl aʒ a ty|你几岁？|nǐ jǐ suì|🎈
Quel âge avez-vous ?|kɛl aʒ a.ve vu|您几岁？（礼貌）|nín jǐ suì|🎩
J'ai vingt ans|ʒe vɛ̃.tɑ̃|我二十岁|wǒ èrshí suì|🎂
J'ai vingt-cinq ans|ʒe vɛ̃t.sɛ̃k ɑ̃|我二十五岁|wǒ èrshíwǔ suì|🎂
l'âge|laʒ|年龄|niánlíng|🎂
un an|œ̃ nɑ̃|一年 / 一岁|yì nián|1️⃣
l'anniversaire|la.ni.vɛʁ.sɛʁ|生日|shēngrì|🎁
Bon anniversaire !|bɔ̃ na.ni.vɛʁ.sɛʁ|生日快乐！|shēngrì kuàilè|🎉`);
addCat("jours","Les jours de la semaine · 星期","📅","#06a77d",`
lundi|lœ̃.di|星期一|xīngqī yī|1️⃣
mardi|maʁ.di|星期二|xīngqī èr|2️⃣
mercredi|mɛʁ.kʁə.di|星期三|xīngqī sān|3️⃣
jeudi|ʒø.di|星期四|xīngqī sì|4️⃣
vendredi|vɑ̃.dʁə.di|星期五|xīngqī wǔ|5️⃣
samedi|sam.di|星期六|xīngqī liù|6️⃣
dimanche|di.mɑ̃ʃ|星期日|xīngqī rì|7️⃣
la semaine|la sə.mɛn|星期 / 周|zhōu|🗓️
le week-end|lə wi.kɛnd|周末|zhōumò|🎉
le lundi|lə lœ̃.di|每个星期一|měi gè xīngqī yī|🔄
Quel jour sommes-nous ?|kɛl ʒuʁ sɔm.nu|今天星期几？|jīntiān xīngqī jǐ|❓
Aujourd'hui, c'est lundi|o.ʒuʁ.dɥi sɛ lœ̃.di|今天是星期一|jīntiān shì xīngqī yī|📍
Demain, c'est mardi|də.mɛ̃ sɛ maʁ.di|明天是星期二|míngtiān shì xīngqī èr|⏭️
Hier, c'était dimanche|jɛʁ se.tɛ di.mɑ̃ʃ|昨天是星期日|zuótiān shì xīngqī rì|⏮️`);
addCat("mois","Les mois & la date · 月份和日期","🗓️","#06a77d",`
janvier|ʒɑ̃.vje|一月|yīyuè|❄️
février|fe.vʁi.je|二月|èryuè|💘
mars|maʁs|三月|sānyuè|🌱
avril|a.vʁil|四月|sìyuè|🌦️
mai|mɛ|五月|wǔyuè|🌷
juin|ʒɥɛ̃|六月|liùyuè|☀️
juillet|ʒɥi.jɛ|七月|qīyuè|🏖️
août|ut|八月|bāyuè|🌞
septembre|sɛp.tɑ̃bʁ|九月|jiǔyuè|🎒
octobre|ɔk.tɔbʁ|十月|shíyuè|🍂
novembre|nɔ.vɑ̃bʁ|十一月|shíyīyuè|🌧️
décembre|de.sɑ̃bʁ|十二月|shí'èryuè|🎄
le mois|lə mwa|月|yuè|📅
l'année|la.ne|年|nián|🎆
la date|la dat|日期|rìqī|🗓️
Quelle est la date ?|kɛl ɛ la dat|今天几号？|jīntiān jǐ hào|❓
C'est le cinq octobre|sɛ lə sɛ̃k ɔk.tɔbʁ|今天是十月五号|jīntiān shì shíyuè wǔ hào|📆
le premier janvier|lə pʁə.mje ʒɑ̃.vje|一月一日|yīyuè yī rì|🎆`);
addCat("n40","Les nombres de 30 à 40 · 数字30到40","🔢","#2a9d8f",`
trente|tʁɑ̃t|三十|sānshí|30
trente et un|tʁɑ̃.te.œ̃|三十一|sānshíyī|31
trente-deux|tʁɑ̃t.dø|三十二|sānshíèr|32
trente-trois|tʁɑ̃t.tʁwa|三十三|sānshísān|33
trente-quatre|tʁɑ̃t.katʁ|三十四|sānshísì|34
trente-cinq|tʁɑ̃t.sɛ̃k|三十五|sānshíwǔ|35
trente-six|tʁɑ̃t.sis|三十六|sānshíliù|36
trente-sept|tʁɑ̃t.sɛt|三十七|sānshíqī|37
trente-huit|tʁɑ̃t.ɥit|三十八|sānshíbā|38
trente-neuf|tʁɑ̃t.nœf|三十九|sānshíjiǔ|39
quarante|ka.ʁɑ̃t|四十|sìshí|40
Le trente et un décembre|lə tʁɑ̃.te.œ̃ de.sɑ̃bʁ|十二月三十一日|shí'èryuè sānshíyī rì|🎇`);
addCat("n100","Les nombres de 40 à 100 · 数字40到100","💯","#2a9d8f",`
quarante|ka.ʁɑ̃t|四十|sìshí|40
cinquante|sɛ̃.kɑ̃t|五十|wǔshí|50
cinquante-cinq|sɛ̃.kɑ̃t.sɛ̃k|五十五|wǔshíwǔ|55
soixante|swa.sɑ̃t|六十|liùshí|60
soixante et un|swa.sɑ̃.te.œ̃|六十一|liùshíyī|61
soixante-dix|swa.sɑ̃t.dis|七十 (60+10)|qīshí|70
soixante et onze|swa.sɑ̃.te.ɔ̃z|七十一 (60+11)|qīshíyī|71
soixante-quinze|swa.sɑ̃t.kɛ̃z|七十五 (60+15)|qīshíwǔ|75
quatre-vingts|ka.tʁə.vɛ̃|八十 (4×20)|bāshí|80
quatre-vingt-un|ka.tʁə.vɛ̃.œ̃|八十一 (4×20+1)|bāshíyī|81
quatre-vingt-dix|ka.tʁə.vɛ̃.dis|九十 (4×20+10)|jiǔshí|90
quatre-vingt-quinze|ka.tʁə.vɛ̃.kɛ̃z|九十五 (4×20+15)|jiǔshíwǔ|95
cent|sɑ̃|一百|yībǎi|100`);
addCat("heure","L'heure · 时间点","🕐","#06a77d",`
Quelle heure est-il ?|kɛl œʁ ɛ.til|现在几点？|xiànzài jǐ diǎn|🕐
Il est une heure|i lɛ tyn œʁ|一点钟|yī diǎn zhōng|🕐
Il est huit heures|i lɛ ɥi tœʁ|八点钟|bā diǎn zhōng|🕗
Il est midi|i lɛ mi.di|中午十二点|zhōngwǔ shí'èr diǎn|🌞
Il est minuit|i lɛ mi.nɥi|午夜十二点|wǔyè shí'èr diǎn|🌙
et quart|e kaʁ|一刻（十五分）|yí kè|🕞
et demie|e də.mi|半（三十分）|bàn|🕧
moins le quart|mwɛ̃ lə kaʁ|差一刻|chà yí kè|🕜
Il est trois heures dix|i lɛ tʁwa zœʁ dis|三点十分|sān diǎn shí fēn|🕒
À quelle heure ?|a kɛl œʁ|几点？|jǐ diǎn|❓
À huit heures|a ɥi tœʁ|在八点|zài bā diǎn|⏰
la minute|la mi.nyt|分钟|fēnzhōng|⏱️
le matin|lə ma.tɛ̃|早上|zǎoshang|🌅
l'après-midi|la.pʁɛ.mi.di|下午|xiàwǔ|🌤️
le soir|lə swaʁ|晚上|wǎnshang|🌆
la nuit|la nɥi|夜晚|yèwǎn|🌃`);
addCat("nombres2","Les nombres de 100 à 1 000 000 · 数字100到一百万","💰","#2a9d8f",`
cent|sɑ̃|一百|yībǎi|💯
deux cents|dø sɑ̃|两百|liǎngbǎi|200
deux cent trois|dø sɑ̃ tʁwa|两百零三|liǎngbǎi líng sān|203
trois cents|tʁwa sɑ̃|三百|sānbǎi|300
mille|mil|一千|yīqiān|🔟
deux mille|dø mil|两千|liǎngqiān|2000
dix mille|di mil|一万|yīwàn|💴
un million|œ̃ mi.ljɔ̃|一百万|yībǎiwàn|💰
Ça coûte cent euros|sa kut sɑ̃ ø.ʁo|这个一百欧元|zhège yìbǎi Ōuyuán|💶`);
setItems("temps",`
aujourd'hui|o.ʒuʁ.dɥi|今天|jīntiān|📍
demain|də.mɛ̃|明天|míngtiān|⏭️
hier|jɛʁ|昨天|zuótiān|⏮️
maintenant|mɛ̃t.nɑ̃|现在|xiànzài|⏱️
le jour|lə ʒuʁ|天 / 白天|tiān|☀️
l'heure|lœʁ|小时 / 点钟|xiǎoshí|🕐
tôt|to|早|zǎo|🌅
tard|taʁ|晚|wǎn|🌙
toujours|tu.ʒuʁ|总是|zǒngshì|♾️
souvent|su.vɑ̃|经常|jīngcháng|🔁
parfois|paʁ.fwa|有时|yǒushí|🔂
jamais|ʒa.mɛ|从不|cóngbù|🚫`,"Le temps · 时间副词");

/* ---- Mots-outils : questions ---- */
addCat("questions","Poser des questions · 提问","❓","#e76f51",`
Est-ce que… ?|ɛs kə|是不是……？（疑问）|shìbushì|❔
quel / quelle|kɛl|哪个 / 什么|nǎge / shénme|🤔
que / quoi|kə / kwa|什么|shénme|❓
où|u|哪里|nǎlǐ|📍
quand|kɑ̃|什么时候|shénme shíhou|🕐
comment|kɔ.mɑ̃|怎么 / 如何|zěnme|🤷
combien|kɔ̃.bjɛ̃|多少|duōshao|🔢
qui|ki|谁|shéi|🧑
pourquoi|puʁ.kwa|为什么|wèishénme|💭
Quel jour est-on ?|kɛl ʒuʁ ɛ.tɔ̃|今天星期几？|jīntiān xīngqī jǐ|📅
Que fais-tu ?|kə fɛ ty|你在做什么？|nǐ zài zuò shénme|🛠️
Où est-ce que tu habites ?|u ɛs kə ty a.bit|你住在哪里？|nǐ zhù zài nǎlǐ|🏠`);

addCat("conj3","Les 7 verbes du 3e groupe · 七个常用不规则动词","🃏","#d62828",`
je vais|ʒə vɛ|我去|wǒ qù|🚶
tu vas|ty va|你去|nǐ qù|🚶
il / elle va|il va|他/她去|tā qù|🚶
nous allons|nu za.lɔ̃|我们去|wǒmen qù|🚶
vous allez|vu za.le|您去|nín qù|🚶
ils / elles vont|il vɔ̃|他们去|tāmen qù|🚶
je fais|ʒə fɛ|我做|wǒ zuò|🛠️
tu fais|ty fɛ|你做|nǐ zuò|🛠️
il / elle fait|il fɛ|他/她做|tā zuò|🛠️
nous faisons|nu fə.zɔ̃|我们做|wǒmen zuò|🛠️
vous faites|vu fɛt|您做|nín zuò|🛠️
ils / elles font|il fɔ̃|他们做|tāmen zuò|🛠️
je prends|ʒə pʁɑ̃|我拿/乘|wǒ ná|🤲
tu prends|ty pʁɑ̃|你拿/乘|nǐ ná|🤲
il / elle prend|il pʁɑ̃|他/她拿/乘|tā ná|🤲
nous prenons|nu pʁə.nɔ̃|我们拿/乘|wǒmen ná|🤲
vous prenez|vu pʁə.ne|您拿/乘|nín ná|🤲
ils / elles prennent|il pʁɛn|他们拿/乘|tāmen ná|🤲
je veux|ʒə vø|我想要|wǒ xiǎng yào|🙏
tu veux|ty vø|你想要|nǐ xiǎng yào|🙏
il / elle veut|il vø|他/她想要|tā xiǎng yào|🙏
nous voulons|nu vu.lɔ̃|我们想要|wǒmen xiǎng yào|🙏
vous voulez|vu vu.le|您想要|nín xiǎng yào|🙏
ils / elles veulent|il vœl|他们想要|tāmen xiǎng yào|🙏
je peux|ʒə pø|我可以|wǒ kěyǐ|💪
tu peux|ty pø|你可以|nǐ kěyǐ|💪
il / elle peut|il pø|他/她可以|tā kěyǐ|💪
nous pouvons|nu pu.vɔ̃|我们可以|wǒmen kěyǐ|💪
vous pouvez|vu pu.ve|您可以|nín kěyǐ|💪
ils / elles peuvent|il pœv|他们可以|tāmen kěyǐ|💪
je dis|ʒə di|我说|wǒ shuō|💬
tu dis|ty di|你说|nǐ shuō|💬
il / elle dit|il di|他/她说|tā shuō|💬
nous disons|nu di.zɔ̃|我们说|wǒmen shuō|💬
vous dites|vu dit|您说|nín shuō|💬
ils / elles disent|il diz|他们说|tāmen shuō|💬
je sais|ʒə sɛ|我知道|wǒ zhīdào|🧠
tu sais|ty sɛ|你知道|nǐ zhīdào|🧠
il / elle sait|il sɛ|他/她知道|tā zhīdào|🧠
nous savons|nu sa.vɔ̃|我们知道|wǒmen zhīdào|🧠
vous savez|vu sa.ve|您知道|nín zhīdào|🧠
ils / elles savent|il sav|他们知道|tāmen zhīdào|🧠`);
addCat("retour","Le retour des vacances · 假期回来","🧳","#00b4d8",`
Où es-tu allé(e) pendant les vacances ?|u ɛ ty a.le pɑ̃.dɑ̃ le va.kɑ̃s|假期你去了哪里？|jiàqī nǐ qù le nǎlǐ|🗺️
Qu'est-ce que tu as fait pendant les vacances ?|kɛs kə ty a fɛ pɑ̃.dɑ̃ le va.kɑ̃s|假期你做了什么？|jiàqī nǐ zuò le shénme|❓
Je suis parti(e) en vacances à…|ʒə sɥi paʁ.ti ɑ̃ va.kɑ̃s a|我去…度假了|wǒ chūfā le|🧳
Comment es-tu allé(e) ?|kɔ.mɑ̃ ɛ.ty a.le|你怎么去的？|nǐ zěnme qù de|🚗
J'y suis allé(e) en train|ʒi sɥi za.le ɑ̃ tʁɛ̃|我坐火车去的|wǒ zuò huǒchē qù de|🚆
Je me suis baigné(e)|ʒə mə sɥi bɛ.ɲe|我游泳了|wǒ yóuyǒng le|🏊
J'ai bronzé|ʒe bʁɔ̃.ze|我晒了太阳|wǒ shài le tàiyáng|😎
J'ai visité un village|ʒe vi.zi.te œ̃ vi.laʒ|我参观了一个村庄|wǒ cānguān le yí gè cūnzhuāng|🏘️
J'ai fait une randonnée|ʒe fɛ yn ʁɑ̃.dɔ.ne|我去徒步了|wǒ qù yuǎnzú le|🥾
J'ai pris des photos|ʒe pʁi de fɔ.to|我拍了照片|wǒ pāi le zhàopiàn|📸
J'ai fait du surf|ʒe fɛ dy sœʁf|我冲浪了|wǒ chōnglàng le|🏄
J'ai fait du bateau|ʒe fɛ dy ba.to|我划船了|wǒ huáchuán le|⛵
J'ai fait de la plongée|ʒe fɛ də la plɔ̃.ʒe|我潜水了|wǒ qiánshuǐ le|🤿
J'ai fait un pique-nique|ʒe fɛ œ̃ pik.nik|我野餐了|wǒ yěcān le|🧺
Je me suis promené(e)|ʒə mə sɥi pʁɔm.ne|我散步了|wǒ sànbù le|🚶
J'ai goûté la cuisine locale|ʒe gu.te la kɥi.zin lɔ.kal|我尝了当地菜|wǒ cháng le běndì cài|🥞
la nature|la na.tyʁ|自然|zìrán|🌿
Tu pars en vacances ?|ty paʁ ɑ̃ va.kɑ̃s|你去度假吗？|nǐ qù dùjià ma|🧳
Je vais en Bretagne|ʒə vɛ ɑ̃ bʁə.taɲ|我去布列塔尼|wǒ qù Bùlièdàníyà|🇫🇷
C'est au bord de la mer|sɛt o bɔʁ də la mɛʁ|在海边|zài hǎibiān|🌊
On prend la voiture|ɔ̃ pʁɑ̃ la vwa.tyʁ|我们开车去|wǒmen kāichē qù|🚗`);

ext("manger",`
J'ai faim|ʒe fɛ̃|我饿了|wǒ è le|😋
J'ai soif|ʒe swaf|我渴了|wǒ kě le|🥵
Je mange|ʒə mɑ̃ʒ|我吃|wǒ chī|🍽️
Je bois de l'eau|ʒə bwa də lo|我喝水|wǒ hē shuǐ|💧
Bon appétit !|bɔ̃ na.pe.ti|祝你好胃口！|zhù nǐ hǎo wèikǒu|😋`);

/* ---- Parcours (ordre du cours FLE débutant) ---- */
STEPS=[["C'est moi : salutations & se présenter · 这是我：问候与自我介绍",["salut","presente","nombres"],"moi"],
["Les verbes de la classe · 课堂动词",["verbes","classe2"],"classe"],
["L'âge, les nombres jusqu'à 30 & poser des questions · 年龄、30以内的数字与提问",["n11","age","questions"],"age"],
["Ma famille · 我的家人",["famille","possessifs","animaux"],"famille"],
["Les jours, les nombres jusqu'à 40, les mois & la date · 星期、40以内的数字、月份与日期",["jours","n40","mois"],"jours"],
["Les nombres jusqu'à 100 & l'heure · 100以内的数字与时间",["n100","heure","nombres2"],"nb100"],
["Le temps qu'il fait · 天气",["meteo","temps"],"meteo"],
["Comment on s'habille · 怎么穿衣",["vetements","couleurs"],"habits"],
["Décrire une personne · 描述一个人",["physique","cheveux"],"portrait"],
["Ma maison · 我的家（房子）",["maison","chambre"],"maison"],
["J'ai faim ! Au restaurant · 我饿了！在餐厅",["manger","fruits","viandes","cuisine","resto"],"faim"],
["Commerces & courses · 商店与购物",["commerces","marche","courses"],"commerces"],
["Chez le médecin · 看医生",["corps","docteur","medic"],"sante"],
["Sports & loisirs · 运动与爱好",["sports","loisirs"],"sports"],
["En ville · 在城里",["ville","directions","taxi"],"ville"],
["Vacances & voyage · 度假与旅行",["vacances","retour","aeroport"],"vacances"],
["Les verbes les plus utiles · 最常用动词",["etre","conj","conj3","verbes2","m:phr"],"verbes"]];

/* ---- Affiches du cours (images) ---- */
const POSTER={verbes:"classe",meteo:"saisons",vetements:"vetements",couleurs:"vetements",physique:"physique",cheveux:"physique",animaux:"animaux",chambre:"chambre",fruits:"nourriture",viandes:"nourriture",cuisine:"cuisine",resto:"restaurant",commerces:"commerces",corps:"sante",docteur:"sante",medic:"sante",sports:"sport",ville:"ville",directions:"ville",taxi:"transports",vacances:"vacances"};
