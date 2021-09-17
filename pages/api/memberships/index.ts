import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import type { OpenseaResponse, Asset} from '../../../utils/openseaTypes'
import type { GenArtResponse} from '../../../utils/genArtTypes'
//import membershipIDs from '../../../data/memberships-ids.json'

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}


//new idea! only grab ones that have available

var unminted = [
7,  13,  15,  17,  31,  50,  55,  81, 119, 121, 127, 128,
129, 130, 138, 162, 170, 174, 184, 190, 200, 209, 213, 215,
221, 222, 223, 224, 225, 227, 228, 229, 230, 239, 243, 261,
267, 269, 273, 274, 275, 276, 277, 279, 280, 281, 282, 283,
284, 285, 286, 287, 294, 297, 323, 342, 344, 347, 349, 362,
365, 366, 372, 381, 386, 393, 401, 408, 416, 417, 418, 420,
429, 434, 456, 457, 492, 502, 518, 532, 535, 536, 548, 554,
561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572,
573, 574, 575, 601,
602, 603, 604, 605, 606, 607, 608, 609, 610,
611, 612, 613, 614, 615, 616, 624, 651, 652, 653,
654, 655, 656, 657, 658, 659, 660, 661, 662, 663,
664, 665, 676, 677, 678, 679, 680, 681, 682, 683,
684, 685, 686, 687, 688, 689, 690, 691, 695, 700,
711, 716, 717, 718, 719, 720, 721, 722, 723, 724,
725, 726, 727, 728, 729, 732, 743, 764, 765, 766,
767, 768, 769, 770, 771, 772, 773, 774, 775, 776,
777, 778,
818,  820,  821,  827,  828,  829,  830,  831,
832,  833,  834,  835,  836,  841,  842,  843,
844,  845,  846,  847,  848,  849,  850,  851,
852,  853,  854,  855,  860,  868,  895,  896,
897,  898,  899,  900,  901,  902,  903,  904,
905,  906,  907,  908,  909, 
936,
1011, 1012,
1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020,
1021, 1022, 1023, 1024, 1025,
1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034,
1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044,
1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054,
1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064,
1065, 1066, 1067, 1068, 1069, 1070, 1074, 1075, 1077, 1103,
1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113,
1114, 1115, 1116, 1117, 1123, 1124, 1125, 1126, 1127, 1128,
1129, 1130, 1131, 1132, 1133, 1134, 1135, 1147, 1148, 1149,
1150, 1151, 1152, 1153, 1154, 1155, 1156, 1157, 1158, 1159,
1160, 1161, 1162, 1194, 1225, 1226, 1227, 1233, 1235, 1236,
1237, 1238, 1239, 1240, 1241, 1242, 1243, 1244, 1245, 1246,
1247, 1248, 1249, 1250, 1251, 1252, 1253, 1254, 1255, 1256,
1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265, 1266,
1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276,
1277, 1278, 1279, 1280, 1281, 1282, 1283, 1284, 1285, 1286,
1287, 1288, 1289, 1290, 1291, 1292, 1293, 1294, 1295, 1296,
1297, 1298, 1299, 1300, 1301, 1302, 1303, 1304, 1305, 1306,
1307, 1308, 1309, 1310, 1311, 1312, 1313, 1314, 1315, 1316,
1317, 1318, 1319, 1320, 1321, 1322, 1323, 1324, 1325, 1326,
1327, 1328, 1329, 1350, 1364, 1373, 1383, 1393, 1397, 1405, 
1505, 1527, 1552, 1564, 1571, 1582, 1584, 1585,
1587, 1588, 1589, 1590, 1595, 1600, 1601, 1602,
1603, 1622, 1624, 1625, 1629, 1631, 1643, 1644,
1651, 1667, 1687, 1688, 1704, 1708, 1709, 1710,
1711, 1713, 1714, 1715, 1716, 1717, 1718, 1719,
1720, 1721, 1722, 1723, 1724, 1729, 1730, 1769,
1773, 1775, 1777, 1788, 1789, 1790, 1795, 1796,
1804, 1820, 1827, 1831, 1832, 1834, 1835, 1837,
1845, 1860, 1861, 1862, 1863, 1864, 1881, 1882,
1912, 1913, 1915,
1919, 1942, 1943, 1944,
1945, 1946, 1947, 1948,
1949, 1950, 1951, 1952,
1953, 1954, 1955, 1956,
1967, 1978, 1994,
2001, 2006, 2012, 2021, 2022, 2023, 2024, 2025, 2026, 2027,
2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2038, 2039,
2040, 2041, 2042, 2044, 2045, 2046, 2047, 2048, 2049, 2050,
2051, 2052, 2053, 2054, 2055, 2056, 2057, 2058, 2061, 2062,
2063, 2067, 2076, 2089, 2090, 2091, 2092, 2093, 2094, 2095,
2096, 2097, 2098, 2099, 2100, 2101, 2102, 2103, 2104, 2105,
2106, 2107, 2108, 2109, 2110, 2111, 2112, 2113, 2114, 2115,
2116, 2117, 2118, 2121, 2154, 2155, 2156, 2157, 2158, 2159,
2160, 2161, 2168, 2169, 2170, 2171, 2172, 2179, 2183, 2186,
2189, 2202, 2205, 2206, 2207, 2208, 2210, 2211, 2213, 2214,
2215, 2216, 2217, 2219, 2222,
2227, 2228, 2240, 2241, 2242, 2243,
2244, 2245, 2246, 2247, 2248, 2251,
2339, 2342, 2363, 2366, 2390, 2391,
2392, 2394, 2423, 2424, 2425, 2426,
2427, 2428, 2429, 2430, 2431, 2432,
2433, 2434, 2466, 2486, 2487,
2513, 2514, 2554, 2560, 2565, 2566, 2567, 2568, 2569, 2570,
2571, 2572, 2573, 2576, 2577, 2578, 2579, 2580, 2581, 2582,
2583, 2584, 2585, 2586, 2587, 2588, 2589, 2590, 2591, 2592,
2593, 2594, 2595, 2596, 2597, 2598, 2599, 2600, 2601, 2602,
2603, 2604, 2605, 2607, 2610, 2612, 2614, 2619, 2621, 2665,
2666, 2698, 2701, 2711, 2733, 2734, 2735, 2736, 2741, 2753,
2756, 2774, 2788, 2798, 2807, 2813, 2823, 2840, 2844, 2863,
2865, 2867, 2874, 2897, 2909, 2916, 2926, 2927, 2953, 2967,
2974, 2983, 2984, 2985, 2986, 2987, 2988, 2989, 2990, 2991,
2992, 3003, 3005, 3006, 3007, 3008, 3009, 3012, 3027, 3032,
3033, 3034, 3035, 3036, 3037, 3038, 3039, 3040, 3041, 3042,
3043, 3044, 3045, 3046, 3057, 3061, 3071, 3072, 3073, 3078,
3082, 3106, 3109, 3110, 3123, 3124, 3125, 3126, 3128, 3129,
3147, 3150, 3152, 3158, 3161, 3204, 3217, 3221, 3224, 3240,
3242, 3243, 3244, 3245, 3246, 3247, 3248, 3249, 3250, 3251,
3252, 3253, 3254, 3255, 3264, 3272, 3295, 3302, 3311, 3313,
3314, 3315, 3316, 3317, 3318, 3319, 3320, 3321, 3322, 3323,
3324, 3325, 3326, 3327, 3329, 3330, 3331, 3332, 3333, 3334,
3335, 3336, 3337, 3338, 3358, 3359, 3360, 3361, 3364, 3365,
3366, 3367, 3368, 3385, 3387, 3389, 3390, 3393, 3399, 3402,
3403, 3404, 3405, 3406, 3407, 3408, 3409, 3410, 3411,
3412, 3413, 3414, 3415, 3416, 3417, 3426, 3457, 3463,
3467, 3487, 3501, 3508, 3512, 3516, 3518, 3531, 3543,
3551, 3557, 3568, 3573, 3598, 3605, 3606, 3615, 3616,
3617, 3618, 3619, 3621, 3646, 3647, 3658, 3674, 3676,
3680, 3681, 3691, 3693, 3697, 3698, 3699, 3700, 3701,
3702, 3703, 3704, 3705, 3706, 3707, 3708, 3709, 3710,
3711, 3712, 3713, 3714, 3715, 3716, 3717, 3718, 3719,
3720, 3721, 3722, 3723, 3724, 3725, 3726, 3727, 3728,
3729, 3730, 3731, 3732, 3733, 3734, 3735, 3736, 3737,
3738, 3739, 3740, 3741, 3742, 3743, 3744, 3745,
  3746, 3747, 3748, 3749, 3750, 3751, 3752, 3753,
  3754, 3755, 3756, 3766, 3775, 3784, 3786, 3793,
  3802, 3807, 3814, 3821, 3823, 3828, 3831, 3855,
  3864, 3866, 3869, 3870, 3880, 3881, 3883, 3893,
  3897, 3911, 3919, 3923, 3924, 3925, 3926, 3927,
  3942, 3959, 3962, 3964, 3965, 3966, 3967, 3968,
  3969, 3972, 3973, 3974, 3975, 3976, 3977, 3978,
  3984, 3997, 3998, 3999,
  4000, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008,
  4009, 4010, 4017, 4018, 4019, 4020, 4027, 4059, 4062,
  4073, 4090, 4117, 4126, 4149, 4152, 4157, 4163, 4169,
  4170, 4171, 4172, 4173, 4174, 4175, 4176, 4177, 4178,
  4179, 4180, 4181, 4182, 4183, 4189, 4199, 4202, 4212,
  4214, 4215, 4228, 4229, 4230, 4231, 4232, 4234, 4235,
  4236, 4237, 4252, 4255, 4278, 4284, 4289, 4291, 4295,
  4300, 4301, 4302, 4303, 4317, 4344, 4360, 4375, 4394,
  4423, 4425, 4454, 4469, 4470, 4489, 4490, 4491, 4492,
  4493, 4494, 4495, 4496, 4497, 4498, 4499,
  4500, 4501, 4502, 4503, 4504, 4516, 4522, 4534, 4555, 4567,
  4587, 4589, 4606, 4615, 4619, 4626, 4640, 4641, 4644, 4647,
  4666, 4667, 4668, 4669, 4670, 4671, 4672, 4673, 4674, 4675,
  4676, 4677, 4678, 4679, 4680, 4684, 4697, 4700, 4701, 4702,
  4703, 4704, 4705, 4706, 4707, 4708, 4709, 4710, 4711, 4712,
  4713, 4714, 4715, 4716, 4717, 4718, 4719, 4723, 4746, 4749,
  4752, 4759, 4766, 4781, 4784, 4800, 4807, 4832, 4833, 4839,
  4858, 4875, 4881, 4882, 4883, 4891, 4898, 4899, 4900, 4901,
  4902, 4903, 4904, 4905, 4906, 4907, 4908, 4912, 4913, 4914,
  4915, 4916, 4918, 4919, 4920, 4921, 4922, 4923, 4924, 4926,
  4927, 4942, 4944,
  4949, 4967, 4978,
  4979, 4982, 4990,
  4991, 4998
]

const RegMemberIDs = unminted //range(0, 3000);


const chunked = chunk(RegMemberIDs, 20)
//const apiKey = process.env.OPENSEA_API_KEY

const fetchMembershipPage = async (ids: string[]) => {
  let url = 'https://api.opensea.io/api/v1/assets?collection=gen-dot-art&'
  url += ids.map((id) => `token_ids=${id}`).join('&')
  // https://api.opensea.io/api/v1/assets?collection=gen-dot-art&token_ids=200

  const res = await fetch(url, {
    headers: {
//      'X-API-KEY': apiKey,
    },
  })  
  const json: OpenseaResponse = await res.json()
  return json.assets
}

export interface GenArtInfo {
  id: string
  price: number
  url: string
  meta_url: string
  svg: string
  //mints_available: any
}

export const fetchMemberships = async () => {
  const data = await pMap(chunked, fetchMembershipPage, { concurrency: 1 })


  const mapped = flatten(data)
    .filter((d) => {
      return d.sell_orders && d.sell_orders.length && d.sell_orders[0].current_price.split('.')[0] > 0
    })
    .map((a: Asset): GenArtInfo => {
      return {
        id: a.token_id,
        price: Number(
          etherUtils.formatUnits(
            BigNumber.from(a.sell_orders[0].current_price.split('.')[0]),
          ),
        ),
        url: a.permalink + '?ref=0x8b3bA76e1cb5017Eb28599a924371A005e693CdF',
        meta_url: 'https://api.gen.art/public/membership?id=' + a.token_id,
        svg: a.image_url,
      //  mints_available:  fetchAvailable(a.token_id) || null,
      }
    })

  

  return {
    memberships: orderBy(mapped, ['price', 'id'], ['asc', 'asc']),
    lastUpdate: new Date().toISOString(),
  }
}



const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await fetchMemberships()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}


export default handler