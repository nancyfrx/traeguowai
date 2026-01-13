const catBreeds = [
    {
        name: "波斯猫",
        image: "https://loremflickr.com/400/400/persian-cat",
        description: "波斯猫是最古老的猫种之一，以其长毛和温和的性格而闻名。它们有着平坦的面孔和大眼睛，是非常受欢迎的宠物猫。",
        personality: "温和、安静、优雅",
        origin: "伊朗",
        size: "大型",
        lifespan: "10-17年"
    },
    {
        name: "英国短毛猫",
        image: "https://loremflickr.com/400/400/british-shorthair-cat",
        description: "英国短毛猫以其圆润的身材和厚实的毛发而著称，性格稳定，适合家庭饲养。它们的毛发有各种颜色，最著名的是蓝色。",
        personality: "独立、友善、温和",
        origin: "英国",
        size: "中大型",
        lifespan: "12-17年"
    },
    {
        name: "美国短毛猫",
        image: "https://loremflickr.com/400/400/american-shorthair-cat",
        description: "美国短毛猫是工作猫的后代，身体强壮，适应力强。它们有着美丽的斑纹，性格活泼，是很好的家庭伴侣。",
        personality: "活泼、友好、适应力强",
        origin: "美国",
        size: "中大型",
        lifespan: "13-17年"
    },
    {
        name: "暹罗猫",
        image: "https://loremflickr.com/400/400/siamese-cat",
        description: "暹罗猫以其独特的重点色和蓝眼睛而闻名，性格外向，喜欢与人交流。它们非常聪明，需要大量的关注和互动。",
        personality: "聪明、活泼、爱叫",
        origin: "泰国",
        size: "中型",
        lifespan: "12-20年"
    },
    {
        name: "缅因猫",
        image: "https://loremflickr.com/400/400/maine-coon-cat",
        description: "缅因猫是最大的家猫品种之一，有着厚实的毛发和像狐狸一样的大尾巴。它们性格温和，被称为'温柔的巨人'。",
        personality: "温和、友善、聪明",
        origin: "美国",
        size: "大型",
        lifespan: "12-15年"
    },
    {
        name: "布偶猫",
        image: "https://loremflickr.com/400/400/ragdoll-cat",
        description: "布偶猫以其温顺的性格和美丽的蓝色眼睛而著称。当被抱起时会完全放松，因此得名。它们非常适合有孩子的家庭。",
        personality: "温顺、友善、放松",
        origin: "美国",
        size: "大型",
        lifespan: "12-17年"
    },
    {
        name: "斯芬克斯猫",
        image: "https://loremflickr.com/400/400/sphynx-cat",
        description: "斯芬克斯猫是一种无毛猫，皮肤温暖而有弹性。它们非常活泼，喜欢与人亲近，需要特殊的皮肤护理。",
        personality: "活泼、亲昵、聪明",
        origin: "加拿大",
        size: "中型",
        lifespan: "8-14年"
    },
    {
        name: "苏格兰折耳猫",
        image: "https://loremflickr.com/400/400/scottish-fold-cat",
        description: "苏格兰折耳猫以其向前折叠的耳朵而闻名，性格温和，喜欢与人相处。它们的耳朵折叠是由于基因突变造成的。",
        personality: "温和、友善、安静",
        origin: "苏格兰",
        size: "中型",
        lifespan: "11-14年"
    },
    {
        name: "孟加拉豹猫",
        image: "https://loremflickr.com/400/400/bengal-cat",
        description: "孟加拉豹猫有着野豹般的斑纹和活泼的性格。它们非常聪明，需要大量的运动和刺激，是活跃的家庭宠物。",
        personality: "活泼、聪明、好奇",
        origin: "美国",
        size: "中大型",
        lifespan: "12-16年"
    },
    {
        name: "俄罗斯蓝猫",
        image: "https://loremflickr.com/400/400/russian-blue-cat",
        description: "俄罗斯蓝猫有着银蓝色的短毛和绿色的眼睛，性格害羞但忠诚。它们非常干净，适合过敏体质的人饲养。",
        personality: "害羞、忠诚、安静",
        origin: "俄罗斯",
        size: "中型",
        lifespan: "15-20年"
    },
    {
        name: "阿比西尼亚猫",
        image: "https://loremflickr.com/400/400/abyssinian-cat",
        description: "阿比西尼亚猫是最古老的猫种之一，有着独特的斑纹和活泼的性格。它们非常活跃，喜欢攀爬和探索。",
        personality: "活泼、好奇、聪明",
        origin: "埃塞俄比亚",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "挪威森林猫",
        image: "https://loremflickr.com/400/400/norwegian-forest-cat",
        description: "挪威森林猫是大型长毛猫，适应寒冷气候。它们有着厚实的双层毛发和强壮的身体，性格温和而独立。",
        personality: "温和、独立、友善",
        origin: "挪威",
        size: "大型",
        lifespan: "14-16年"
    },
    {
        name: "德文卷毛猫",
        image: "https://loremflickr.com/400/400/devon-rex-cat",
        description: "德文卷毛猫有着卷曲的短毛和大耳朵，性格非常活泼和亲昵。它们被称为'猫中的猴子'，喜欢玩耍和与人互动。",
        personality: "活泼、亲昵、聪明",
        origin: "英国",
        size: "中小型",
        lifespan: "9-15年"
    },
    {
        name: "柯尼斯卷毛猫",
        image: "https://loremflickr.com/400/400/cornish-rex-cat",
        description: "柯尼斯卷毛猫是最古老的卷毛猫品种，有着波浪状的毛发和纤细的身材。它们非常活跃，喜欢与人亲近。",
        personality: "活泼、亲昵、好奇",
        origin: "英国",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "土耳其安卡拉猫",
        image: "https://loremflickr.com/400/400/turkish-angora-cat",
        description: "土耳其安卡拉猫是最古老的长毛猫品种之一，有着丝滑的长毛和优雅的姿态。它们性格活泼，喜欢水。",
        personality: "活泼、聪明、优雅",
        origin: "土耳其",
        size: "中大型",
        lifespan: "12-18年"
    },
    {
        name: "土耳其梵猫",
        image: "https://loremflickr.com/400/400/turkish-van-cat",
        description: "土耳其梵猫以其独特的'梵'斑纹和喜欢水的特性而闻名。它们有着半长毛和独特的性格，非常聪明。",
        personality: "聪明、活泼、喜欢水",
        origin: "土耳其",
        size: "中大型",
        lifespan: "12-17年"
    },
    {
        name: "巴厘猫",
        image: "https://loremflickr.com/400/400/balinese-cat",
        description: "巴厘猫本质上是长毛版的暹罗猫，有着美丽的重点色和蓝眼睛。它们性格活泼，喜欢与人交流。",
        personality: "活泼、聪明、爱叫",
        origin: "美国",
        size: "中型",
        lifespan: "12-18年"
    },
    {
        name: "东方短毛猫",
        image: "https://loremflickr.com/400/400/oriental-shorthair-cat",
        description: "东方短毛猫有着纤细的身材和各种各样的颜色。它们非常活泼和聪明，需要大量的关注和互动。",
        personality: "活泼、聪明、亲昵",
        origin: "泰国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "雪鞋猫",
        image: "https://loremflickr.com/400/400/snowshoe-cat",
        description: "雪鞋猫是暹罗猫和美国短毛猫的杂交品种，有着白色的'雪鞋'和蓝色的眼睛。性格温和而活泼。",
        personality: "温和、活泼、聪明",
        origin: "美国",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "新加坡猫",
        image: "https://loremflickr.com/400/400/singapura-cat",
        description: "新加坡猫是最小的家猫品种之一，有着短而光滑的毛发。它们非常活泼和好奇，喜欢探索周围环境。",
        personality: "活泼、好奇、亲昵",
        origin: "新加坡",
        size: "小型",
        lifespan: "11-15年"
    },
    {
        name: "孟买猫",
        image: "https://loremflickr.com/400/400/bombay-cat",
        description: "孟买猫有着黑色的短毛和金色的眼睛，被称为'小黑豹'。它们性格温和，喜欢与人亲近。",
        personality: "温和、亲昵、安静",
        origin: "美国",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "缅甸猫",
        image: "https://loremflickr.com/400/400/burmese-cat",
        description: "缅甸猫有着深色的毛发和金色的眼睛，性格非常亲昵和活泼。它们被称为'狗一样的猫'，喜欢跟随主人。",
        personality: "亲昵、活泼、聪明",
        origin: "缅甸",
        size: "中型",
        lifespan: "13-18年"
    },
    {
        name: "索马里猫",
        image: "https://loremflickr.com/400/400/somali-cat",
        description: "索马里猫是长毛版的阿比西尼亚猫，有着美丽的斑纹和狐狸般的大尾巴。它们非常活泼和好奇。",
        personality: "活泼、好奇、聪明",
        origin: "埃塞俄比亚",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "埃及猫",
        image: "https://loremflickr.com/400/400/egyptian-mau-cat",
        description: "埃及猫是最古老的猫种之一，有着自然的斑纹和野性的外观。它们非常聪明，喜欢水。",
        personality: "聪明、活泼、喜欢水",
        origin: "埃及",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "加菲猫",
        image: "https://loremflickr.com/400/400/exotic-shorthair-cat",
        description: "加菲猫是波斯猫的变种，有着平坦的面孔和短而密的毛发。它们性格温和，适合家庭饲养。",
        personality: "温和、安静、友善",
        origin: "美国",
        size: "中大型",
        lifespan: "10-15年"
    },
    {
        name: "美国卷耳猫",
        image: "https://loremflickr.com/400/400/american-curl-cat",
        description: "美国卷耳猫有着向后卷曲的耳朵和友好的性格。它们非常聪明，喜欢与人互动和玩耍。",
        personality: "友好、聪明、活泼",
        origin: "美国",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "曼岛猫",
        image: "https://loremflickr.com/400/400/manx-cat",
        description: "曼岛猫以其无尾或短尾而闻名，有着圆润的身材和厚实的毛发。它们性格温和，是很好的家庭宠物。",
        personality: "温和、友善、适应力强",
        origin: "曼岛",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "西伯利亚猫",
        image: "https://loremflickr.com/400/400/siberian-cat",
        description: "西伯利亚猫是俄罗斯的自然品种，有着厚实的三层毛发和强壮的身体。它们适应寒冷气候，性格温和。",
        personality: "温和、友善、独立",
        origin: "俄罗斯",
        size: "大型",
        lifespan: "12-18年"
    },
    {
        name: "日本短尾猫",
        image: "https://loremflickr.com/400/400/japanese-bobtail-cat",
        description: "日本短尾猫有着像兔子一样的短尾和友好的性格。它们在日本被视为好运的象征，非常受欢迎。",
        personality: "友好、活泼、聪明",
        origin: "日本",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "奥西猫",
        image: "https://loremflickr.com/400/400/ocicat",
        description: "奥西猫有着野豹般的斑纹和活泼的性格。它们非常聪明，需要大量的运动和刺激。",
        personality: "活泼、聪明、好奇",
        origin: "美国",
        size: "中大型",
        lifespan: "12-16年"
    },
    {
        name: "萨凡纳猫",
        image: "https://loremflickr.com/400/400/savannah-cat",
        description: "萨凡纳猫是薮猫和家猫的杂交品种，有着野性的外观和活泼的性格。它们非常聪明，需要大量的空间和运动。",
        personality: "活泼、聪明、好奇",
        origin: "美国",
        size: "大型",
        lifespan: "12-20年"
    },
    {
        name: "塞尔柯克卷毛猫",
        image: "https://loremflickr.com/400/400/selkirk-rex-cat",
        description: "塞尔柯克卷毛猫有着卷曲的毛发和圆润的身材。它们性格温和，适合家庭饲养。",
        personality: "温和、友善、放松",
        origin: "美国",
        size: "中大型",
        lifespan: "12-16年"
    },
    {
        name: "拉格多尔猫",
        image: "https://loremflickr.com/400/400/ragdoll-cat",
        description: "拉格多尔猫是布偶猫的变种，有着温顺的性格和美丽的蓝色眼睛。它们非常适合有孩子的家庭。",
        personality: "温顺、友善、放松",
        origin: "美国",
        size: "大型",
        lifespan: "12-17年"
    },
    {
        name: "中国狸花猫",
        image: "https://loremflickr.com/400/400/chinese-lihua-cat",
        description: "中国狸花猫是中国本土的自然品种，有着美丽的斑纹和强壮的身体。它们性格独立，适应力强。",
        personality: "独立、聪明、适应力强",
        origin: "中国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "橘猫",
        image: "https://loremflickr.com/400/400/orange-tabby-cat",
        description: "橘猫不是特定的品种，而是指橘色的猫。它们通常性格温和，容易发胖，被称为'大橘'。",
        personality: "温和、友善、贪吃",
        origin: "世界各地",
        size: "中大型",
        lifespan: "12-15年"
    },
    {
        name: "三花猫",
        image: "https://loremflickr.com/400/400/calico-cat",
        description: "三花猫是指有黑、橘、白三种颜色的猫，绝大多数是母猫。它们性格各异，但通常都很友善。",
        personality: "友善、独立、聪明",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "玳瑁猫",
        image: "https://loremflickr.com/400/400/tortoiseshell-cat",
        description: "玳瑁猫是指有黑、橘混合斑纹的猫，绝大多数是母猫。它们性格独特，通常很有个性。",
        personality: "独立、聪明、有个性",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "奶牛猫",
        image: "https://loremflickr.com/400/400/tuxedo-cat",
        description: "奶牛猫是指黑白相间的猫，通常很活泼和好奇。它们被称为'猫中的哈士奇'，有时会做出一些奇怪的行为。",
        personality: "活泼、好奇、有个性",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "长毛猫",
        image: "https://loremflickr.com/400/400/longhair-cat",
        description: "长毛猫是指有长毛的猫，需要定期梳理。它们通常很优雅，毛发美丽。",
        personality: "温和、优雅、安静",
        origin: "世界各地",
        size: "中大型",
        lifespan: "12-16年"
    },
    {
        name: "短毛猫",
        image: "https://loremflickr.com/400/400/shorthair-cat",
        description: "短毛猫是指有短毛的猫，容易打理。它们通常很活跃，适应力强。",
        personality: "活泼、适应力强、聪明",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "无毛猫",
        image: "https://loremflickr.com/400/400/hairless-cat",
        description: "无毛猫是指没有毛发的猫，皮肤温暖而有弹性。它们非常活泼，需要特殊的皮肤护理。",
        personality: "活泼、亲昵、聪明",
        origin: "世界各地",
        size: "中型",
        lifespan: "8-14年"
    },
    {
        name: "卷毛猫",
        image: "https://loremflickr.com/400/400/curly-hair-cat",
        description: "卷毛猫是指有卷曲毛发的猫，毛发柔软而独特。它们通常很活泼，喜欢与人亲近。",
        personality: "活泼、亲昵、聪明",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "重点色猫",
        image: "https://loremflickr.com/400/400/pointed-cat",
        description: "重点色猫是指有重点色斑纹的猫，通常有蓝色的眼睛。它们性格活泼，喜欢与人交流。",
        personality: "活泼、聪明、爱叫",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-18年"
    },
    {
        name: "虎斑猫",
        image: "https://loremflickr.com/400/400/tabby-cat",
        description: "虎斑猫是指有虎斑斑纹的猫，通常很强壮和独立。它们是很好的捕鼠能手。",
        personality: "独立、聪明、强壮",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "纯色猫",
        image: "https://loremflickr.com/400/400/solid-color-cat",
        description: "纯色猫是指只有一种颜色的猫，毛发颜色均匀。它们通常很优雅，性格温和。",
        personality: "温和、优雅、安静",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "双色猫",
        image: "https://loremflickr.com/400/400/bicolor-cat",
        description: "双色猫是指有两种颜色的猫，通常很漂亮。它们性格各异，但通常都很友善。",
        personality: "友善、聪明、活泼",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "花色猫",
        image: "https://loremflickr.com/400/400/tortoiseshell-cat",
        description: "花色猫是指有多种颜色的猫，通常很漂亮。它们性格各异，但通常都很友善。",
        personality: "友善、聪明、活泼",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "野猫",
        image: "https://loremflickr.com/400/400/wild-cat",
        description: "野猫是指生活在野外的猫，通常很强壮和独立。它们是很好的捕猎者。",
        personality: "独立、强壮、警惕",
        origin: "世界各地",
        size: "中型",
        lifespan: "8-12年"
    },
    {
        name: "斯芬克斯无毛猫",
        image: "https://loremflickr.com/400/400/sphynx-cat",
        description: "斯芬克斯无毛猫是一种特殊的无毛猫品种，皮肤温暖而有弹性。它们非常活泼，喜欢与人亲近。",
        personality: "活泼、亲昵、聪明",
        origin: "加拿大",
        size: "中型",
        lifespan: "8-14年"
    },
    {
        name: "缅因库恩猫",
        image: "https://loremflickr.com/400/400/maine-coon-cat",
        description: "缅因库恩猫是缅因猫的另一种称呼，是最大的家猫品种之一。它们性格温和，被称为'温柔的巨人'。",
        personality: "温和、友善、聪明",
        origin: "美国",
        size: "大型",
        lifespan: "12-15年"
    },
    {
        name: "阿比西尼亚",
        image: "https://loremflickr.com/400/400/abyssinian-cat",
        description: "阿比西尼亚猫是最古老的猫种之一，有着独特的斑纹和活泼的性格。它们非常活跃，喜欢攀爬和探索。",
        personality: "活泼、好奇、聪明",
        origin: "埃塞俄比亚",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "孟加拉",
        image: "https://loremflickr.com/400/400/bengal-cat",
        description: "孟加拉猫有着野豹般的斑纹和活泼的性格。它们非常聪明，需要大量的运动和刺激，是活跃的家庭宠物。",
        personality: "活泼、聪明、好奇",
        origin: "美国",
        size: "中大型",
        lifespan: "12-16年"
    },
    {
        name: "布娃娃",
        image: "https://loremflickr.com/400/400/ragdoll-cat",
        description: "布娃娃猫是布偶猫的另一种称呼，以其温顺的性格和美丽的蓝色眼睛而著称。它们非常适合有孩子的家庭。",
        personality: "温顺、友善、放松",
        origin: "美国",
        size: "大型",
        lifespan: "12-17年"
    },
    {
        name: "苏格兰折耳",
        image: "https://loremflickr.com/400/400/scottish-fold-cat",
        description: "苏格兰折耳猫以其向前折叠的耳朵而闻名，性格温和，喜欢与人相处。它们的耳朵折叠是由于基因突变造成的。",
        personality: "温和、友善、安静",
        origin: "苏格兰",
        size: "中型",
        lifespan: "11-14年"
    },
    {
        name: "俄罗斯蓝",
        image: "https://loremflickr.com/400/400/russian-blue-cat",
        description: "俄罗斯蓝猫有着银蓝色的短毛和绿色的眼睛，性格害羞但忠诚。它们非常干净，适合过敏体质的人饲养。",
        personality: "害羞、忠诚、安静",
        origin: "俄罗斯",
        size: "中型",
        lifespan: "15-20年"
    },
    {
        name: "挪威森林",
        image: "https://loremflickr.com/400/400/norwegian-forest-cat",
        description: "挪威森林猫是大型长毛猫，适应寒冷气候。它们有着厚实的双层毛发和强壮的身体，性格温和而独立。",
        personality: "温和、独立、友善",
        origin: "挪威",
        size: "大型",
        lifespan: "14-16年"
    },
    {
        name: "德文雷克斯",
        image: "https://loremflickr.com/400/400/devon-rex-cat",
        description: "德文雷克斯猫有着卷曲的短毛和大耳朵，性格非常活泼和亲昵。它们被称为'猫中的猴子'。",
        personality: "活泼、亲昵、聪明",
        origin: "英国",
        size: "中小型",
        lifespan: "9-15年"
    },
    {
        name: "柯尼斯雷克斯",
        image: "https://loremflickr.com/400/400/cornish-rex-cat",
        description: "柯尼斯雷克斯猫是最古老的卷毛猫品种，有着波浪状的毛发和纤细的身材。它们非常活跃。",
        personality: "活泼、亲昵、好奇",
        origin: "英国",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "土耳其安卡拉",
        image: "https://loremflickr.com/400/400/turkish-angora-cat",
        description: "土耳其安卡拉猫是最古老的长毛猫品种之一，有着丝滑的长毛和优雅的姿态。它们性格活泼，喜欢水。",
        personality: "活泼、聪明、优雅",
        origin: "土耳其",
        size: "中大型",
        lifespan: "12-18年"
    },
    {
        name: "土耳其梵",
        image: "https://loremflickr.com/400/400/turkish-van-cat",
        description: "土耳其梵猫以其独特的'梵'斑纹和喜欢水的特性而闻名。它们有着半长毛和独特的性格。",
        personality: "聪明、活泼、喜欢水",
        origin: "土耳其",
        size: "中大型",
        lifespan: "12-17年"
    },
    {
        name: "巴厘",
        image: "https://loremflickr.com/400/400/balinese-cat",
        description: "巴厘猫本质上是长毛版的暹罗猫，有着美丽的重点色和蓝眼睛。它们性格活泼，喜欢与人交流。",
        personality: "活泼、聪明、爱叫",
        origin: "美国",
        size: "中型",
        lifespan: "12-18年"
    },
    {
        name: "东方",
        image: "https://loremflickr.com/400/400/oriental-shorthair-cat",
        description: "东方猫有着纤细的身材和各种各样的颜色。它们非常活泼和聪明，需要大量的关注和互动。",
        personality: "活泼、聪明、亲昵",
        origin: "泰国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "雪鞋",
        image: "https://loremflickr.com/400/400/snowshoe-cat",
        description: "雪鞋猫是暹罗猫和美国短毛猫的杂交品种，有着白色的'雪鞋'和蓝色的眼睛。性格温和而活泼。",
        personality: "温和、活泼、聪明",
        origin: "美国",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "新加坡",
        image: "https://loremflickr.com/400/400/singapura-cat",
        description: "新加坡猫是最小的家猫品种之一，有着短而光滑的毛发。它们非常活泼和好奇。",
        personality: "活泼、好奇、亲昵",
        origin: "新加坡",
        size: "小型",
        lifespan: "11-15年"
    },
    {
        name: "孟买",
        image: "https://loremflickr.com/400/400/bombay-cat",
        description: "孟买猫有着黑色的短毛和金色的眼睛，被称为'小黑豹'。它们性格温和，喜欢与人亲近。",
        personality: "温和、亲昵、安静",
        origin: "美国",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "缅甸",
        image: "https://loremflickr.com/400/400/burmese-cat",
        description: "缅甸猫有着深色的毛发和金色的眼睛，性格非常亲昵和活泼。它们被称为'狗一样的猫'。",
        personality: "亲昵、活泼、聪明",
        origin: "缅甸",
        size: "中型",
        lifespan: "13-18年"
    },
    {
        name: "索马里",
        image: "https://loremflickr.com/400/400/somali-cat",
        description: "索马里猫是长毛版的阿比西尼亚猫，有着美丽的斑纹和狐狸般的大尾巴。它们非常活泼和好奇。",
        personality: "活泼、好奇、聪明",
        origin: "埃塞俄比亚",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "埃及",
        image: "https://loremflickr.com/400/400/egyptian-mau-cat",
        description: "埃及猫是最古老的猫种之一，有着自然的斑纹和野性的外观。它们非常聪明，喜欢水。",
        personality: "聪明、活泼、喜欢水",
        origin: "埃及",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "美国卷耳",
        image: "https://loremflickr.com/400/400/american-curl-cat",
        description: "美国卷耳猫有着向后卷曲的耳朵和友好的性格。它们非常聪明，喜欢与人互动和玩耍。",
        personality: "友好、聪明、活泼",
        origin: "美国",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "曼岛",
        image: "https://loremflickr.com/400/400/manx-cat",
        description: "曼岛猫以其无尾或短尾而闻名，有着圆润的身材和厚实的毛发。它们性格温和，是很好的家庭宠物。",
        personality: "温和、友善、适应力强",
        origin: "曼岛",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "西伯利亚",
        image: "https://loremflickr.com/400/400/siberian-cat",
        description: "西伯利亚猫是俄罗斯的自然品种，有着厚实的三层毛发和强壮的身体。它们适应寒冷气候，性格温和。",
        personality: "温和、友善、独立",
        origin: "俄罗斯",
        size: "大型",
        lifespan: "12-18年"
    },
    {
        name: "日本短尾",
        image: "https://loremflickr.com/400/400/japanese-bobtail-cat",
        description: "日本短尾猫有着像兔子一样的短尾和友好的性格。它们在日本被视为好运的象征。",
        personality: "友好、活泼、聪明",
        origin: "日本",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "奥西",
        image: "https://loremflickr.com/400/400/ocicat",
        description: "奥西猫有着野豹般的斑纹和活泼的性格。它们非常聪明，需要大量的运动和刺激。",
        personality: "活泼、聪明、好奇",
        origin: "美国",
        size: "中大型",
        lifespan: "12-16年"
    },
    {
        name: "萨凡纳",
        image: "https://loremflickr.com/400/400/savannah-cat",
        description: "萨凡纳猫是薮猫和家猫的杂交品种，有着野性的外观和活泼的性格。它们非常聪明。",
        personality: "活泼、聪明、好奇",
        origin: "美国",
        size: "大型",
        lifespan: "12-20年"
    },
    {
        name: "塞尔柯克雷克斯",
        image: "https://loremflickr.com/400/400/selkirk-rex-cat",
        description: "塞尔柯克卷毛猫有着卷曲的毛发和圆润的身材。它们性格温和，适合家庭饲养。",
        personality: "温和、友善、放松",
        origin: "美国",
        size: "中大型",
        lifespan: "12-16年"
    },
    {
        name: "拉格多尔",
        image: "https://loremflickr.com/400/400/ragdoll-cat",
        description: "拉格多尔猫是布偶猫的变种，有着温顺的性格和美丽的蓝色眼睛。它们非常适合有孩子的家庭。",
        personality: "温顺、友善、放松",
        origin: "美国",
        size: "大型",
        lifespan: "12-17年"
    },
    {
        name: "中国狸花",
        image: "https://loremflickr.com/400/400/chinese-lihua-cat",
        description: "中国狸花猫是中国本土的自然品种，有着美丽的斑纹和强壮的身体。它们性格独立，适应力强。",
        personality: "独立、聪明、适应力强",
        origin: "中国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "橘色猫",
        image: "https://loremflickr.com/400/400/orange-tabby-cat",
        description: "橘色猫不是特定的品种，而是指橘色的猫。它们通常性格温和，容易发胖，被称为'大橘'。",
        personality: "温和、友善、贪吃",
        origin: "世界各地",
        size: "中大型",
        lifespan: "12-15年"
    },
    {
        name: "三色猫",
        image: "https://loremflickr.com/400/400/calico-cat",
        description: "三色猫是指有黑、橘、白三种颜色的猫，绝大多数是母猫。它们性格各异，但通常都很友善。",
        personality: "友善、独立、聪明",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "玳瑁色猫",
        image: "https://loremflickr.com/400/400/tortoiseshell-cat",
        description: "玳瑁猫是指有黑、橘混合斑纹的猫，绝大多数是母猫。它们性格独特，通常很有个性。",
        personality: "独立、聪明、有个性",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "黑白猫",
        image: "https://loremflickr.com/400/400/tuxedo-cat",
        description: "黑白猫是指黑白相间的猫，通常很活泼和好奇。它们被称为'猫中的哈士奇'。",
        personality: "活泼、好奇、有个性",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "长毛种猫",
        image: "https://loremflickr.com/400/400/longhair-cat",
        description: "长毛种猫是指有长毛的猫，需要定期梳理。它们通常很优雅，毛发美丽。",
        personality: "温和、优雅、安静",
        origin: "世界各地",
        size: "中大型",
        lifespan: "12-16年"
    },
    {
        name: "短毛种猫",
        image: "https://loremflickr.com/400/400/shorthair-cat",
        description: "短毛种猫是指有短毛的猫，容易打理。它们通常很活跃，适应力强。",
        personality: "活泼、适应力强、聪明",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "无毛种猫",
        image: "https://loremflickr.com/400/400/hairless-cat",
        description: "无毛种猫是指没有毛发的猫，皮肤温暖而有弹性。它们非常活泼，需要特殊的皮肤护理。",
        personality: "活泼、亲昵、聪明",
        origin: "世界各地",
        size: "中型",
        lifespan: "8-14年"
    },
    {
        name: "卷毛种猫",
        image: "https://loremflickr.com/400/400/curly-hair-cat",
        description: "卷毛种猫是指有卷曲毛发的猫，毛发柔软而独特。它们通常很活泼，喜欢与人亲近。",
        personality: "活泼、亲昵、聪明",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "重点色种猫",
        image: "https://loremflickr.com/400/400/pointed-cat",
        description: "重点色种猫是指有重点色斑纹的猫，通常有蓝色的眼睛。它们性格活泼，喜欢与人交流。",
        personality: "活泼、聪明、爱叫",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-18年"
    },
    {
        name: "虎斑种猫",
        image: "https://loremflickr.com/400/400/tabby-cat",
        description: "虎斑种猫是指有虎斑斑纹的猫，通常很强壮和独立。它们是很好的捕鼠能手。",
        personality: "独立、聪明、强壮",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "纯色种猫",
        image: "https://loremflickr.com/400/400/solid-color-cat",
        description: "纯色种猫是指只有一种颜色的猫，毛发颜色均匀。它们通常很优雅，性格温和。",
        personality: "温和、优雅、安静",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "双色种猫",
        image: "https://loremflickr.com/400/400/bicolor-cat",
        description: "双色种猫是指有两种颜色的猫，通常很漂亮。它们性格各异，但通常都很友善。",
        personality: "友善、聪明、活泼",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "花色种猫",
        image: "https://loremflickr.com/400/400/tortoiseshell-cat",
        description: "花色种猫是指有多种颜色的猫，通常很漂亮。它们性格各异，但通常都很友善。",
        personality: "友善、聪明、活泼",
        origin: "世界各地",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "野生种猫",
        image: "https://loremflickr.com/400/400/wild-cat",
        description: "野生种猫是指生活在野外的猫，通常很强壮和独立。它们是很好的捕猎者。",
        personality: "独立、强壮、警惕",
        origin: "世界各地",
        size: "中型",
        lifespan: "8-12年"
    }
];

const dogBreeds = [
    {
        name: "金毛寻回犬",
        image: "https://loremflickr.com/400/400/golden-retriever",
        description: "金毛寻回犬是最受欢迎的家庭犬之一，以其金色的毛发和温和的性格而闻名。它们非常聪明，容易训练，是优秀的伴侣犬。",
        personality: "温和、友善、聪明",
        origin: "苏格兰",
        size: "大型",
        lifespan: "10-12年"
    },
    {
        name: "拉布拉多犬",
        image: "https://loremflickr.com/400/400/labrador-retriever",
        description: "拉布拉多犬是世界上最受欢迎的犬种之一，以其友善的性格和出色的能力而著称。它们是优秀的导盲犬和工作犬。",
        personality: "友善、活泼、聪明",
        origin: "加拿大",
        size: "大型",
        lifespan: "10-14年"
    },
    {
        name: "德国牧羊犬",
        image: "https://loremflickr.com/400/400/german-shepherd",
        description: "德国牧羊犬是优秀的工作犬，以其聪明和忠诚而闻名。它们经常被用作警犬和军犬，也是很好的家庭守护犬。",
        personality: "忠诚、聪明、勇敢",
        origin: "德国",
        size: "大型",
        lifespan: "9-13年"
    },
    {
        name: "哈士奇",
        image: "https://loremflickr.com/400/400/siberian-husky",
        description: "哈士奇以其美丽的蓝色眼睛和厚实的毛发而著称。它们非常活泼，需要大量的运动，有时会发出奇怪的叫声。",
        personality: "活泼、友好、爱叫",
        origin: "西伯利亚",
        size: "中大型",
        lifespan: "12-14年"
    },
    {
        name: "边境牧羊犬",
        image: "https://loremflickr.com/400/400/border-collie",
        description: "边境牧羊犬是最聪明的犬种之一，以其出色的牧羊能力和敏捷性而闻名。它们需要大量的智力和体力刺激。",
        personality: "聪明、活泼、敏捷",
        origin: "英国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "贵宾犬",
        image: "https://loremflickr.com/400/400/poodle",
        description: "贵宾犬以其卷曲的毛发和聪明的头脑而著称。它们有三种尺寸：标准型、迷你型和玩具型，都非常适合家庭饲养。",
        personality: "聪明、活泼、优雅",
        origin: "法国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "柯基犬",
        image: "https://loremflickr.com/400/400/corgi",
        description: "柯基犬以其短腿和长身体而闻名，是英国女王的喜爱犬种。它们性格活泼，非常适合家庭饲养。",
        personality: "活泼、友善、勇敢",
        origin: "威尔士",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "法国斗牛犬",
        image: "https://loremflickr.com/400/400/french-bulldog",
        description: "法国斗牛犬以其蝙蝠般的耳朵和温和的性格而著称。它们体型小巧，适合公寓饲养，是很好的城市伴侣犬。",
        personality: "温和、友善、安静",
        origin: "法国",
        size: "小型",
        lifespan: "10-12年"
    },
    {
        name: "柴犬",
        image: "https://loremflickr.com/400/400/shiba-inu",
        description: "柴犬是日本最古老的犬种之一，以其狐狸般的外表和独立的性格而闻名。它们非常干净，像猫一样爱清洁。",
        personality: "独立、忠诚、安静",
        origin: "日本",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "比格犬",
        image: "https://loremflickr.com/400/400/beagle",
        description: "比格犬以其出色的嗅觉和友好的性格而著称。它们是优秀的猎犬，也是很好的家庭宠物，特别适合有孩子的家庭。",
        personality: "友善、活泼、好奇",
        origin: "英国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "罗威纳犬",
        image: "https://loremflickr.com/400/400/rottweiler",
        description: "罗威纳犬是强壮的工作犬，以其忠诚和保护本能而闻名。它们需要早期社会化训练，是优秀的守护犬。",
        personality: "忠诚、勇敢、保护欲强",
        origin: "德国",
        size: "大型",
        lifespan: "8-10年"
    },
    {
        name: "杜宾犬",
        image: "https://loremflickr.com/400/400/doberman",
        description: "杜宾犬是优雅而强壮的工作犬，以其聪明和忠诚而著称。它们是优秀的警犬和家庭守护犬。",
        personality: "忠诚、聪明、勇敢",
        origin: "德国",
        size: "大型",
        lifespan: "10-13年"
    },
    {
        name: "大丹犬",
        image: "https://loremflickr.com/400/400/great-dane",
        description: "大丹犬是世界上最大的犬种之一，被称为'温柔的巨人'。它们性格温和，非常适合家庭饲养。",
        personality: "温和、友善、优雅",
        origin: "德国",
        size: "大型",
        lifespan: "8-10年"
    },
    {
        name: "圣伯纳犬",
        image: "https://loremflickr.com/400/400/saint-bernard",
        description: "圣伯纳犬以其救援工作和温和的性格而闻名。它们体型巨大，但非常友善，是优秀的家庭犬。",
        personality: "温和、友善、耐心",
        origin: "瑞士",
        size: "大型",
        lifespan: "8-10年"
    },
    {
        name: "阿拉斯加雪橇犬",
        image: "https://loremflickr.com/400/400/alaskan-malamute",
        description: "阿拉斯加雪橇犬是大型工作犬，以其强壮的身体和厚实的毛发而著称。它们非常友好，适合家庭饲养。",
        personality: "友好、活泼、忠诚",
        origin: "阿拉斯加",
        size: "大型",
        lifespan: "10-14年"
    },
    {
        name: "萨摩耶犬",
        image: "https://loremflickr.com/400/400/samoyed",
        description: "萨摩耶犬以其雪白的毛发和'微笑'的表情而闻名。它们性格非常友好，被称为'微笑天使'。",
        personality: "友好、活泼、温和",
        origin: "西伯利亚",
        size: "中大型",
        lifespan: "12-14年"
    },
    {
        name: "博美犬",
        image: "https://loremflickr.com/400/400/pomeranian",
        description: "博美犬是小型犬，以其蓬松的毛发和活泼的性格而著称。它们非常聪明，适合公寓饲养。",
        personality: "活泼、聪明、警觉",
        origin: "德国",
        size: "小型",
        lifespan: "12-16年"
    },
    {
        name: "吉娃娃",
        image: "https://loremflickr.com/400/400/chihuahua",
        description: "吉娃娃是世界上最小犬种之一，以其大眼睛和勇敢的性格而闻名。它们非常忠诚，适合城市生活。",
        personality: "勇敢、忠诚、警觉",
        origin: "墨西哥",
        size: "小型",
        lifespan: "14-16年"
    },
    {
        name: "约克夏梗",
        image: "https://loremflickr.com/400/400/yorkshire-terrier",
        description: "约克夏梗是小型犬，以其丝滑的长毛和勇敢的性格而著称。它们非常聪明，适合公寓饲养。",
        personality: "勇敢、聪明、活泼",
        origin: "英国",
        size: "小型",
        lifespan: "13-16年"
    },
    {
        name: "雪纳瑞犬",
        image: "https://loremflickr.com/400/400/schnauzer",
        description: "雪纳瑞犬以其胡须和警惕的性格而闻名。它们有三种尺寸：巨型、标准型和迷你型，都非常聪明。",
        personality: "聪明、警惕、忠诚",
        origin: "德国",
        size: "中型",
        lifespan: "13-16年"
    },
    {
        name: "拳师犬",
        image: "https://loremflickr.com/400/400/boxer",
        description: "拳师犬以其强壮的身体和温和的性格而著称。它们非常忠诚，是优秀的家庭守护犬。",
        personality: "忠诚、温和、活泼",
        origin: "德国",
        size: "大型",
        lifespan: "10-12年"
    },
    {
        name: "斗牛犬",
        image: "https://loremflickr.com/400/400/bulldog",
        description: "斗牛犬以其平坦的面孔和温和的性格而闻名。它们非常安静，适合公寓饲养。",
        personality: "温和、安静、友善",
        origin: "英国",
        size: "中型",
        lifespan: "8-10年"
    },
    {
        name: "可卡犬",
        image: "https://loremflickr.com/400/400/cocker-spaniel",
        description: "可卡犬以其美丽的长毛和温和的性格而著称。它们是优秀的猎犬，也是很好的家庭宠物。",
        personality: "温和、友善、活泼",
        origin: "西班牙",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "威玛犬",
        image: "https://loremflickr.com/400/400/weimaraner",
        description: "威玛犬以其银灰色的毛发和出色的运动能力而闻名。它们非常聪明，需要大量的运动。",
        personality: "聪明、活泼、忠诚",
        origin: "德国",
        size: "大型",
        lifespan: "10-13年"
    },
    {
        name: "灵缇犬",
        image: "https://loremflickr.com/400/400/greyhound",
        description: "灵缇犬是世界上跑得最快的犬种之一，以其优雅的身姿和温和的性格而著称。它们是优秀的赛犬。",
        personality: "温和、安静、优雅",
        origin: "埃及",
        size: "大型",
        lifespan: "10-13年"
    },
    {
        name: "惠比特犬",
        image: "https://loremflickr.com/400/400/whippet",
        description: "惠比特犬是灵缇犬的小型版本，以其速度和温和的性格而闻名。它们非常适合家庭饲养。",
        personality: "温和、安静、活泼",
        origin: "英国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "巴哥犬",
        image: "https://loremflickr.com/400/400/pug",
        description: "巴哥犬以其皱褶的面孔和温和的性格而闻名。它们非常友善，适合公寓饲养。",
        personality: "温和、友善、安静",
        origin: "中国",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "马士提夫犬",
        image: "https://loremflickr.com/400/400/mastiff",
        description: "马士提夫犬是世界上最大的犬种之一，以其强壮的身体和温和的性格而著称。它们是优秀的守护犬。",
        personality: "温和、忠诚、保护欲强",
        origin: "英国",
        size: "大型",
        lifespan: "6-10年"
    },
    {
        name: "纽芬兰犬",
        image: "https://loremflickr.com/400/400/newfoundland",
        description: "纽芬兰犬以其出色的游泳能力和温和的性格而闻名。它们是优秀的水上救援犬。",
        personality: "温和、友善、耐心",
        origin: "加拿大",
        size: "大型",
        lifespan: "8-10年"
    },
    {
        name: "伯恩山犬",
        image: "https://loremflickr.com/400/400/bernese-mountain-dog",
        description: "伯恩山犬以其美丽的三色毛发和温和的性格而著称。它们非常适合有孩子的家庭。",
        personality: "温和、友善、耐心",
        origin: "瑞士",
        size: "大型",
        lifespan: "6-8年"
    },
    {
        name: "藏獒",
        image: "https://loremflickr.com/400/400/tibetan-mastiff",
        description: "藏獒是古老的守护犬，以其强壮的身体和忠诚的性格而闻名。它们是优秀的守护犬。",
        personality: "忠诚、勇敢、保护欲强",
        origin: "西藏",
        size: "大型",
        lifespan: "10-14年"
    },
    {
        name: "松狮犬",
        image: "https://loremflickr.com/400/400/chow-chow",
        description: "松狮犬以其蓝黑色的舌头和独立的性格而闻名。它们非常干净，像猫一样爱清洁。",
        personality: "独立、安静、忠诚",
        origin: "中国",
        size: "中大型",
        lifespan: "9-15年"
    },
    {
        name: "沙皮犬",
        image: "https://loremflickr.com/400/400/shar-pei",
        description: "沙皮犬以其皱褶的皮肤和独特的蓝色舌头而闻名。它们性格安静，适合家庭饲养。",
        personality: "安静、忠诚、独立",
        origin: "中国",
        size: "中型",
        lifespan: "8-12年"
    },
    {
        name: "蝴蝶犬",
        image: "https://loremflickr.com/400/400/papillon",
        description: "蝴蝶犬以其像蝴蝶翅膀一样的大耳朵而闻名。它们非常聪明，适合公寓饲养。",
        personality: "聪明、活泼、友善",
        origin: "法国",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "北京犬",
        image: "https://loremflickr.com/400/400/pekingese",
        description: "北京犬是中国古代皇室犬种，以其扁平的面孔和高贵的气质而闻名。它们非常忠诚。",
        personality: "忠诚、勇敢、高贵",
        origin: "中国",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "西施犬",
        image: "https://loremflickr.com/400/400/shih-tzu",
        description: "西施犬以其美丽的长毛和高贵的气质而著称。它们非常友善，适合家庭饲养。",
        personality: "友善、活泼、高贵",
        origin: "中国",
        size: "小型",
        lifespan: "10-16年"
    },
    {
        name: "拉萨犬",
        image: "https://loremflickr.com/400/400/lhasa-apso",
        description: "拉萨犬是西藏的古老犬种，以其长毛和警觉的性格而闻名。它们是优秀的看门犬。",
        personality: "警觉、忠诚、活泼",
        origin: "西藏",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "马尔济斯犬",
        image: "https://loremflickr.com/400/400/maltese",
        description: "马尔济斯犬以其雪白的长毛和温和的性格而著称。它们非常适合公寓饲养。",
        personality: "温和、友善、活泼",
        origin: "马耳他",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "比熊犬",
        image: "https://loremflickr.com/400/400/bichon-frise",
        description: "比熊犬以其蓬松的白色毛发和快乐的性格而闻名。它们非常友善，适合家庭饲养。",
        personality: "友善、活泼、快乐",
        origin: "法国",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "西高地白梗",
        image: "https://loremflickr.com/400/400/west-highland-white-terrier",
        description: "西高地白梗以其雪白的毛发和勇敢的性格而著称。它们非常聪明，适合家庭饲养。",
        personality: "勇敢、聪明、活泼",
        origin: "苏格兰",
        size: "小型",
        lifespan: "12-16年"
    },
    {
        name: "苏格兰梗",
        image: "https://loremflickr.com/400/400/scottish-terrier",
        description: "苏格兰梗以其独特的胡须和独立的性格而闻名。它们非常忠诚，是优秀的看门犬。",
        personality: "独立、忠诚、警觉",
        origin: "苏格兰",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "杰克罗素梗",
        image: "https://loremflickr.com/400/400/jack-russell-terrier",
        description: "杰克罗素梗以其活泼的性格和出色的运动能力而著称。它们需要大量的运动和刺激。",
        personality: "活泼、聪明、勇敢",
        origin: "英国",
        size: "小型",
        lifespan: "13-16年"
    },
    {
        name: "梗犬",
        image: "https://loremflickr.com/400/400/terrier",
        description: "梗犬是一类小型犬，以其勇敢的性格和出色的捕猎能力而闻名。它们非常活泼。",
        personality: "勇敢、活泼、聪明",
        origin: "英国",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "腊肠犬",
        image: "https://loremflickr.com/400/400/dachshund",
        description: "腊肠犬以其长身体和短腿而闻名。它们非常勇敢，是优秀的猎犬。",
        personality: "勇敢、聪明、活泼",
        origin: "德国",
        size: "小型",
        lifespan: "12-16年"
    },
    {
        name: "阿富汗猎犬",
        image: "https://loremflickr.com/400/400/afghan-hound",
        description: "阿富汗猎犬以其优雅的长毛和独特的气质而著称。它们非常独立，需要大量的运动。",
        personality: "独立、优雅、高贵",
        origin: "阿富汗",
        size: "大型",
        lifespan: "12-14年"
    },
    {
        name: "巴辛吉犬",
        image: "https://loremflickr.com/400/400/basenji",
        description: "巴辛吉犬以其不会吠叫和独特的叫声而闻名。它们非常干净，像猫一样爱清洁。",
        personality: "独立、安静、聪明",
        origin: "非洲",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "中华田园犬",
        image: "https://loremflickr.com/400/400/chinese-rural-dog",
        description: "中华田园犬是中国本土的自然品种，有着强壮的身体和忠诚的性格。它们适应力强，是优秀的看门犬。",
        personality: "忠诚、适应力强、聪明",
        origin: "中国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "比特犬",
        image: "https://loremflickr.com/400/400/pitbull",
        description: "比特犬以其强壮的身体和忠诚的性格而闻名。它们需要早期社会化训练，是优秀的家庭犬。",
        personality: "忠诚、勇敢、聪明",
        origin: "美国",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "阿拉斯加",
        image: "https://loremflickr.com/400/400/alaskan-malamute",
        description: "阿拉斯加雪橇犬是大型工作犬，以其强壮的身体和厚实的毛发而著称。它们非常友好，适合家庭饲养。",
        personality: "友好、活泼、忠诚",
        origin: "阿拉斯加",
        size: "大型",
        lifespan: "10-14年"
    },
    {
        name: "泰迪",
        image: "https://loremflickr.com/400/400/toy-poodle",
        description: "泰迪是贵宾犬的变种，以其卷曲的毛发和可爱的外表而闻名。它们非常聪明，适合公寓饲养。",
        personality: "聪明、活泼、友善",
        origin: "法国",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "边境牧羊",
        image: "https://loremflickr.com/400/400/border-collie",
        description: "边境牧羊犬是最聪明的犬种之一，以其出色的牧羊能力和敏捷性而闻名。它们需要大量的智力和体力刺激。",
        personality: "聪明、活泼、敏捷",
        origin: "英国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "金毛",
        image: "https://loremflickr.com/400/400/golden-retriever",
        description: "金毛犬是最受欢迎的家庭犬之一，以其金色的毛发和温和的性格而闻名。它们非常聪明，容易训练。",
        personality: "温和、友善、聪明",
        origin: "苏格兰",
        size: "大型",
        lifespan: "10-12年"
    },
    {
        name: "拉布拉多",
        image: "https://loremflickr.com/400/400/labrador-retriever",
        description: "拉布拉多是世界上最受欢迎的犬种之一，以其友善的性格和出色的能力而著称。它们是优秀的导盲犬和工作犬。",
        personality: "友善、活泼、聪明",
        origin: "加拿大",
        size: "大型",
        lifespan: "10-14年"
    },
    {
        name: "德牧",
        image: "https://loremflickr.com/400/400/german-shepherd",
        description: "德国牧羊犬是优秀的工作犬，以其聪明和忠诚而闻名。它们经常被用作警犬和军犬。",
        personality: "忠诚、聪明、勇敢",
        origin: "德国",
        size: "大型",
        lifespan: "9-13年"
    },
    {
        name: "二哈",
        image: "https://loremflickr.com/400/400/siberian-husky",
        description: "哈士奇以其美丽的蓝色眼睛和厚实的毛发而著称。它们非常活泼，需要大量的运动，有时会发出奇怪的叫声。",
        personality: "活泼、友好、爱叫",
        origin: "西伯利亚",
        size: "中大型",
        lifespan: "12-14年"
    },
    {
        name: "边牧",
        image: "https://loremflickr.com/400/400/border-collie",
        description: "边境牧羊犬是最聪明的犬种之一，以其出色的牧羊能力和敏捷性而闻名。它们需要大量的智力和体力刺激。",
        personality: "聪明、活泼、敏捷",
        origin: "英国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "贵宾",
        image: "https://loremflickr.com/400/400/poodle",
        description: "贵宾犬以其卷曲的毛发和聪明的头脑而著称。它们有三种尺寸：标准型、迷你型和玩具型。",
        personality: "聪明、活泼、优雅",
        origin: "法国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "柯基",
        image: "https://loremflickr.com/400/400/corgi",
        description: "柯基犬以其短腿和长身体而闻名，是英国女王的喜爱犬种。它们性格活泼，非常适合家庭饲养。",
        personality: "活泼、友善、勇敢",
        origin: "威尔士",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "法斗",
        image: "https://loremflickr.com/400/400/french-bulldog",
        description: "法国斗牛犬以其蝙蝠般的耳朵和温和的性格而著称。它们体型小巧，适合公寓饲养。",
        personality: "温和、友善、安静",
        origin: "法国",
        size: "小型",
        lifespan: "10-12年"
    },
    {
        name: "柴",
        image: "https://loremflickr.com/400/400/shiba-inu",
        description: "柴犬是日本最古老的犬种之一，以其狐狸般的外表和独立的性格而闻名。它们非常干净。",
        personality: "独立、忠诚、安静",
        origin: "日本",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "比格",
        image: "https://loremflickr.com/400/400/beagle",
        description: "比格犬以其出色的嗅觉和友好的性格而著称。它们是优秀的猎犬，也是很好的家庭宠物。",
        personality: "友善、活泼、好奇",
        origin: "英国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "罗威纳",
        image: "https://loremflickr.com/400/400/rottweiler",
        description: "罗威纳犬是强壮的工作犬，以其忠诚和保护本能而闻名。它们需要早期社会化训练，是优秀的守护犬。",
        personality: "忠诚、勇敢、保护欲强",
        origin: "德国",
        size: "大型",
        lifespan: "8-10年"
    },
    {
        name: "杜宾",
        image: "https://loremflickr.com/400/400/doberman",
        description: "杜宾犬是优雅而强壮的工作犬，以其聪明和忠诚而著称。它们是优秀的警犬和家庭守护犬。",
        personality: "忠诚、聪明、勇敢",
        origin: "德国",
        size: "大型",
        lifespan: "10-13年"
    },
    {
        name: "大丹",
        image: "https://loremflickr.com/400/400/great-dane",
        description: "大丹犬是世界上最大的犬种之一，被称为'温柔的巨人'。它们性格温和，非常适合家庭饲养。",
        personality: "温和、友善、优雅",
        origin: "德国",
        size: "大型",
        lifespan: "8-10年"
    },
    {
        name: "圣伯纳",
        image: "https://loremflickr.com/400/400/saint-bernard",
        description: "圣伯纳犬以其救援工作和温和的性格而闻名。它们体型巨大，但非常友善，是优秀的家庭犬。",
        personality: "温和、友善、耐心",
        origin: "瑞士",
        size: "大型",
        lifespan: "8-10年"
    },
    {
        name: "萨摩耶",
        image: "https://loremflickr.com/400/400/samoyed",
        description: "萨摩耶犬以其雪白的毛发和'微笑'的表情而闻名。它们性格非常友好，被称为'微笑天使'。",
        personality: "友好、活泼、温和",
        origin: "西伯利亚",
        size: "中大型",
        lifespan: "12-14年"
    },
    {
        name: "博美",
        image: "https://loremflickr.com/400/400/pomeranian",
        description: "博美犬是小型犬，以其蓬松的毛发和活泼的性格而著称。它们非常聪明，适合公寓饲养。",
        personality: "活泼、聪明、警觉",
        origin: "德国",
        size: "小型",
        lifespan: "12-16年"
    },
    {
        name: "吉娃娃",
        image: "https://loremflickr.com/400/400/chihuahua",
        description: "吉娃娃是世界上最小犬种之一，以其大眼睛和勇敢的性格而闻名。它们非常忠诚，适合城市生活。",
        personality: "勇敢、忠诚、警觉",
        origin: "墨西哥",
        size: "小型",
        lifespan: "14-16年"
    },
    {
        name: "约克夏",
        image: "https://loremflickr.com/400/400/yorkshire-terrier",
        description: "约克夏梗是小型犬，以其丝滑的长毛和勇敢的性格而著称。它们非常聪明，适合公寓饲养。",
        personality: "勇敢、聪明、活泼",
        origin: "英国",
        size: "小型",
        lifespan: "13-16年"
    },
    {
        name: "雪纳瑞",
        image: "https://loremflickr.com/400/400/schnauzer",
        description: "雪纳瑞犬以其胡须和警惕的性格而闻名。它们有三种尺寸：巨型、标准型和迷你型。",
        personality: "聪明、警惕、忠诚",
        origin: "德国",
        size: "中型",
        lifespan: "13-16年"
    },
    {
        name: "拳师",
        image: "https://loremflickr.com/400/400/boxer",
        description: "拳师犬以其强壮的身体和温和的性格而著称。它们非常忠诚，是优秀的家庭守护犬。",
        personality: "忠诚、温和、活泼",
        origin: "德国",
        size: "大型",
        lifespan: "10-12年"
    },
    {
        name: "斗牛",
        image: "https://loremflickr.com/400/400/bulldog",
        description: "斗牛犬以其平坦的面孔和温和的性格而闻名。它们非常安静，适合公寓饲养。",
        personality: "温和、安静、友善",
        origin: "英国",
        size: "中型",
        lifespan: "8-10年"
    },
    {
        name: "可卡",
        image: "https://loremflickr.com/400/400/cocker-spaniel",
        description: "可卡犬以其美丽的长毛和温和的性格而著称。它们是优秀的猎犬，也是很好的家庭宠物。",
        personality: "温和、友善、活泼",
        origin: "西班牙",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "威玛",
        image: "https://loremflickr.com/400/400/weimaraner",
        description: "威玛犬以其银灰色的毛发和出色的运动能力而闻名。它们非常聪明，需要大量的运动。",
        personality: "聪明、活泼、忠诚",
        origin: "德国",
        size: "大型",
        lifespan: "10-13年"
    },
    {
        name: "灵缇",
        image: "https://loremflickr.com/400/400/greyhound",
        description: "灵缇犬是世界上跑得最快的犬种之一，以其优雅的身姿和温和的性格而著称。它们是优秀的赛犬。",
        personality: "温和、安静、优雅",
        origin: "埃及",
        size: "大型",
        lifespan: "10-13年"
    },
    {
        name: "惠比特",
        image: "https://loremflickr.com/400/400/whippet",
        description: "惠比特犬是灵缇犬的小型版本，以其速度和温和的性格而闻名。它们非常适合家庭饲养。",
        personality: "温和、安静、活泼",
        origin: "英国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "巴哥",
        image: "https://loremflickr.com/400/400/pug",
        description: "巴哥犬以其皱褶的面孔和温和的性格而闻名。它们非常友善，适合公寓饲养。",
        personality: "温和、友善、安静",
        origin: "中国",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "马士提夫",
        image: "https://loremflickr.com/400/400/mastiff",
        description: "马士提夫犬是世界上最大的犬种之一，以其强壮的身体和温和的性格而著称。它们是优秀的守护犬。",
        personality: "温和、忠诚、保护欲强",
        origin: "英国",
        size: "大型",
        lifespan: "6-10年"
    },
    {
        name: "纽芬兰",
        image: "https://loremflickr.com/400/400/newfoundland",
        description: "纽芬兰犬以其出色的游泳能力和温和的性格而闻名。它们是优秀的水上救援犬。",
        personality: "温和、友善、耐心",
        origin: "加拿大",
        size: "大型",
        lifespan: "8-10年"
    },
    {
        name: "伯恩山",
        image: "https://loremflickr.com/400/400/bernese-mountain-dog",
        description: "伯恩山犬以其美丽的三色毛发和温和的性格而著称。它们非常适合有孩子的家庭。",
        personality: "温和、友善、耐心",
        origin: "瑞士",
        size: "大型",
        lifespan: "6-8年"
    },
    {
        name: "藏獒",
        image: "https://loremflickr.com/400/400/tibetan-mastiff",
        description: "藏獒是古老的守护犬，以其强壮的身体和忠诚的性格而闻名。它们是优秀的守护犬。",
        personality: "忠诚、勇敢、保护欲强",
        origin: "西藏",
        size: "大型",
        lifespan: "10-14年"
    },
    {
        name: "松狮",
        image: "https://loremflickr.com/400/400/chow-chow",
        description: "松狮犬以其蓝黑色的舌头和独立的性格而闻名。它们非常干净，像猫一样爱清洁。",
        personality: "独立、安静、忠诚",
        origin: "中国",
        size: "中大型",
        lifespan: "9-15年"
    },
    {
        name: "沙皮",
        image: "https://loremflickr.com/400/400/shar-pei",
        description: "沙皮犬以其皱褶的皮肤和独特的蓝色舌头而闻名。它们性格安静，适合家庭饲养。",
        personality: "安静、忠诚、独立",
        origin: "中国",
        size: "中型",
        lifespan: "8-12年"
    },
    {
        name: "蝴蝶",
        image: "https://loremflickr.com/400/400/papillon",
        description: "蝴蝶犬以其像蝴蝶翅膀一样的大耳朵而闻名。它们非常聪明，适合公寓饲养。",
        personality: "聪明、活泼、友善",
        origin: "法国",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "北京",
        image: "https://loremflickr.com/400/400/pekingese",
        description: "北京犬是中国古代皇室犬种，以其扁平的面孔和高贵的气质而闻名。它们非常忠诚。",
        personality: "忠诚、勇敢、高贵",
        origin: "中国",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "西施",
        image: "https://loremflickr.com/400/400/shih-tzu",
        description: "西施犬以其美丽的长毛和高贵的气质而著称。它们非常友善，适合家庭饲养。",
        personality: "友善、活泼、高贵",
        origin: "中国",
        size: "小型",
        lifespan: "10-16年"
    },
    {
        name: "拉萨",
        image: "https://loremflickr.com/400/400/lhasa-apso",
        description: "拉萨犬是西藏的古老犬种，以其长毛和警觉的性格而闻名。它们是优秀的看门犬。",
        personality: "警觉、忠诚、活泼",
        origin: "西藏",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "马尔济斯",
        image: "https://loremflickr.com/400/400/maltese",
        description: "马尔济斯犬以其雪白的长毛和温和的性格而著称。它们非常适合公寓饲养。",
        personality: "温和、友善、活泼",
        origin: "马耳他",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "比熊",
        image: "https://loremflickr.com/400/400/bichon-frise",
        description: "比熊犬以其蓬松的白色毛发和快乐的性格而闻名。它们非常友善，适合家庭饲养。",
        personality: "友善、活泼、快乐",
        origin: "法国",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "西高地",
        image: "https://loremflickr.com/400/400/west-highland-white-terrier",
        description: "西高地白梗以其雪白的毛发和勇敢的性格而著称。它们非常聪明，适合家庭饲养。",
        personality: "勇敢、聪明、活泼",
        origin: "苏格兰",
        size: "小型",
        lifespan: "12-16年"
    },
    {
        name: "苏格兰",
        image: "https://loremflickr.com/400/400/scottish-terrier",
        description: "苏格兰梗以其独特的胡须和独立的性格而闻名。它们非常忠诚，是优秀的看门犬。",
        personality: "独立、忠诚、警觉",
        origin: "苏格兰",
        size: "小型",
        lifespan: "12-15年"
    },
    {
        name: "杰克罗素",
        image: "https://loremflickr.com/400/400/jack-russell-terrier",
        description: "杰克罗素梗以其活泼的性格和出色的运动能力而著称。它们需要大量的运动和刺激。",
        personality: "活泼、聪明、勇敢",
        origin: "英国",
        size: "小型",
        lifespan: "13-16年"
    },
    {
        name: "腊肠",
        image: "https://loremflickr.com/400/400/dachshund",
        description: "腊肠犬以其长身体和短腿而闻名。它们非常勇敢，是优秀的猎犬。",
        personality: "勇敢、聪明、活泼",
        origin: "德国",
        size: "小型",
        lifespan: "12-16年"
    },
    {
        name: "阿富汗",
        image: "https://loremflickr.com/400/400/afghan-hound",
        description: "阿富汗猎犬以其优雅的长毛和独特的气质而著称。它们非常独立，需要大量的运动。",
        personality: "独立、优雅、高贵",
        origin: "阿富汗",
        size: "大型",
        lifespan: "12-14年"
    },
    {
        name: "巴辛吉",
        image: "https://loremflickr.com/400/400/basenji",
        description: "巴辛吉犬以其不会吠叫和独特的叫声而闻名。它们非常干净，像猫一样爱清洁。",
        personality: "独立、安静、聪明",
        origin: "非洲",
        size: "中型",
        lifespan: "12-16年"
    },
    {
        name: "中华田园",
        image: "https://loremflickr.com/400/400/chinese-rural-dog",
        description: "中华田园犬是中国本土的自然品种，有着强壮的身体和忠诚的性格。它们适应力强，是优秀的看门犬。",
        personality: "忠诚、适应力强、聪明",
        origin: "中国",
        size: "中型",
        lifespan: "12-15年"
    },
    {
        name: "比特",
        image: "https://loremflickr.com/400/400/pitbull",
        description: "比特犬以其强壮的身体和忠诚的性格而闻名。它们需要早期社会化训练，是优秀的家庭犬。",
        personality: "忠诚、勇敢、聪明",
        origin: "美国",
        size: "中型",
        lifespan: "12-16年"
    }
];
