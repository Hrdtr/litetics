export interface ReferrersData {
  [medium: string]: {
    [name: string]: {
      domains: string[]
      parameters?: string[]
    }
  }
}

export const referrers: ReferrersData = {
  unknown: {
    'Google': {
      domains: [
        'support.google.com',
        'developers.google.com',
        'maps.google.com',
        'accounts.google.com',
        'drive.google.com',
        'sites.google.com',
        'groups.google.com',
        'groups.google.co.uk',
      ],
    },
    'Yandex Maps': {
      domains: [
        'maps.yandex.ru',
        'maps.yandex.ua',
        'maps.yandex.com',
        'maps.yandex.by',
        'n.maps.yandex.ru',
      ],
      parameters: [
        'text',
      ],
    },
    'Yahoo!': {
      domains: [
        'finance.yahoo.com',
        'news.yahoo.com',
        'eurosport.yahoo.com',
        'sports.yahoo.com',
        'astrology.yahoo.com',
        'travel.yahoo.com',
        'answers.yahoo.com',
        'screen.yahoo.com',
        'weather.yahoo.com',
        'messenger.yahoo.com',
        'games.yahoo.com',
        'shopping.yahoo.net',
        'movies.yahoo.com',
        'cars.yahoo.com',
        'lifestyle.yahoo.com',
        'omg.yahoo.com',
        'match.yahoo.net',
      ],
    },
  },
  search: {
    'TalkTalk': {
      domains: [
        'www.talktalk.co.uk',
      ],
      parameters: [
        'query',
      ],
    },
    '1.cz': {
      domains: [
        '1.cz',
      ],
      parameters: [
        'q',
      ],
    },
    'Softonic': {
      domains: [
        'search.softonic.com',
      ],
      parameters: [
        'q',
      ],
    },
    'GAIS': {
      domains: [
        'gais.cs.ccu.edu.tw',
      ],
      parameters: [
        'q',
      ],
    },
    'Freecause': {
      domains: [
        'search.freecause.com',
      ],
      parameters: [
        'p',
      ],
    },
    '360.cn': {
      domains: [
        'so.360.cn',
        'www.so.com',
      ],
      parameters: [
        'q',
      ],
    },
    'RPMFind': {
      domains: [
        'rpmfind.net',
        'fr2.rpmfind.net',
      ],
      parameters: [
        'query',
      ],
    },
    'Comcast': {
      domains: [
        'serach.comcast.net',
      ],
      parameters: [
        'q',
      ],
    },
    'Voila': {
      domains: [
        'search.ke.voila.fr',
        'www.lemoteur.fr',
      ],
      parameters: [
        'rdata',
        'kw',
      ],
    },
    'Nifty': {
      domains: [
        'search.nifty.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Atlas': {
      domains: [
        'searchatlas.centrum.cz',
      ],
      parameters: [
        'q',
      ],
    },
    '2gis': {
      domains: [
        '2gis.ru',
        'www.2gis.ru',
        'link.2gis.ru',
        'www.link.2gis.ru',
      ],
    },
    'Lo.st': {
      domains: [
        'lo.st',
      ],
      parameters: [
        'x_query',
      ],
    },
    'DasTelefonbuch': {
      domains: [
        'www1.dastelefonbuch.de',
      ],
      parameters: [
        'kw',
      ],
    },
    'Fireball': {
      domains: [
        'www.fireball.de',
      ],
      parameters: [
        'q',
      ],
    },
    '1und1': {
      domains: [
        'suche.1und1.de',
      ],
      parameters: [
        'q',
      ],
    },
    'Virgilio': {
      domains: [
        'ricerca.virgilio.it',
        'ricercaimmagini.virgilio.it',
        'ricercavideo.virgilio.it',
        'ricercanews.virgilio.it',
        'mobile.virgilio.it',
      ],
      parameters: [
        'qs',
      ],
    },
    'Telstra': {
      domains: [
        'search.media.telstra.com.au',
      ],
      parameters: [
        'find',
      ],
    },
    'Web.nl': {
      domains: [
        'www.web.nl',
      ],
      parameters: [
        'zoekwoord',
      ],
    },
    'Plazoo': {
      domains: [
        'www.plazoo.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Goyellow.de': {
      domains: [
        'www.goyellow.de',
      ],
      parameters: [
        'MDN',
      ],
    },
    'AOL': {
      domains: [
        'search.aol.com',
        'search.aol.it',
        'aolsearch.aol.com',
        'aolsearch.com',
        'www.aolrecherche.aol.fr',
        'www.aolrecherches.aol.fr',
        'www.aolimages.aol.fr',
        'aim.search.aol.com',
        'www.recherche.aol.fr',
        'recherche.aol.fr',
        'find.web.aol.com',
        'recherche.aol.ca',
        'aolsearch.aol.co.uk',
        'search.aol.co.uk',
        'aolrecherche.aol.fr',
        'sucheaol.aol.de',
        'suche.aol.de',
        'suche.aolsvc.de',
        'aolbusqueda.aol.com.mx',
        'alicesuche.aol.de',
        'alicesuchet.aol.de',
        'suchet2.aol.de',
        'search.hp.my.aol.com.au',
        'search.hp.my.aol.de',
        'search.hp.my.aol.it',
        'search-intl.netscape.com',
      ],
      parameters: [
        'q',
        'query',
      ],
    },
    'Acoon': {
      domains: [
        'www.acoon.de',
      ],
      parameters: [
        'begriff',
      ],
    },
    'Free': {
      domains: [
        'search.free.fr',
        'search1-2.free.fr',
        'search1-1.free.fr',
      ],
      parameters: [
        'q',
      ],
    },
    'Apollo Latvia': {
      domains: [
        'apollo.lv/portal/search/',
      ],
      parameters: [
        'q',
      ],
    },
    'HighBeam': {
      domains: [
        'www.highbeam.com',
      ],
      parameters: [
        'q',
      ],
    },
    'I-play': {
      domains: [
        'start.iplay.com',
      ],
      parameters: [
        'q',
      ],
    },
    'FriendFeed': {
      domains: [
        'friendfeed.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Yasni': {
      domains: [
        'www.yasni.de',
        'www.yasni.com',
        'www.yasni.co.uk',
        'www.yasni.ch',
        'www.yasni.at',
      ],
      parameters: [
        'query',
      ],
    },
    'Gigablast': {
      domains: [
        'www.gigablast.com',
        'dir.gigablast.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Arcor': {
      domains: [
        'www.arcor.de',
      ],
      parameters: [
        'Keywords',
      ],
    },
    'arama': {
      domains: [
        'arama.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Fixsuche': {
      domains: [
        'www.fixsuche.de',
      ],
      parameters: [
        'q',
      ],
    },
    'Apontador': {
      domains: [
        'apontador.com.br',
        'www.apontador.com.br',
      ],
      parameters: [
        'q',
      ],
    },
    'Search.com': {
      domains: [
        'www.search.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Monstercrawler': {
      domains: [
        'www.monstercrawler.com',
      ],
      parameters: [
        'qry',
      ],
    },
    'Google Images': {
      domains: [
        'google.ac/imgres',
        'google.ad/imgres',
        'google.ae/imgres',
        'google.am/imgres',
        'google.as/imgres',
        'google.at/imgres',
        'google.az/imgres',
        'google.ba/imgres',
        'google.be/imgres',
        'google.bf/imgres',
        'google.bg/imgres',
        'google.bi/imgres',
        'google.bj/imgres',
        'google.bs/imgres',
        'google.by/imgres',
        'google.ca/imgres',
        'google.cat/imgres',
        'google.cc/imgres',
        'google.cd/imgres',
        'google.cf/imgres',
        'google.cg/imgres',
        'google.ch/imgres',
        'google.ci/imgres',
        'google.cl/imgres',
        'google.cm/imgres',
        'google.cn/imgres',
        'google.co.bw/imgres',
        'google.co.ck/imgres',
        'google.co.cr/imgres',
        'google.co.id/imgres',
        'google.co.il/imgres',
        'google.co.in/imgres',
        'google.co.jp/imgres',
        'google.co.ke/imgres',
        'google.co.kr/imgres',
        'google.co.ls/imgres',
        'google.co.ma/imgres',
        'google.co.mz/imgres',
        'google.co.nz/imgres',
        'google.co.th/imgres',
        'google.co.tz/imgres',
        'google.co.ug/imgres',
        'google.co.uk/imgres',
        'google.co.uz/imgres',
        'google.co.ve/imgres',
        'google.co.vi/imgres',
        'google.co.za/imgres',
        'google.co.zm/imgres',
        'google.co.zw/imgres',
        'google.com/imgres',
        'google.com.af/imgres',
        'google.com.ag/imgres',
        'google.com.ai/imgres',
        'google.com.ar/imgres',
        'google.com.au/imgres',
        'google.com.bd/imgres',
        'google.com.bh/imgres',
        'google.com.bn/imgres',
        'google.com.bo/imgres',
        'google.com.br/imgres',
        'google.com.by/imgres',
        'google.com.bz/imgres',
        'google.com.co/imgres',
        'google.com.cu/imgres',
        'google.com.cy/imgres',
        'google.com.do/imgres',
        'google.com.ec/imgres',
        'google.com.eg/imgres',
        'google.com.et/imgres',
        'google.com.fj/imgres',
        'google.com.gh/imgres',
        'google.com.gi/imgres',
        'google.com.gt/imgres',
        'google.com.hk/imgres',
        'google.com.jm/imgres',
        'google.com.kh/imgres',
        'google.com.kw/imgres',
        'google.com.lb/imgres',
        'google.com.lc/imgres',
        'google.com.ly/imgres',
        'google.com.mt/imgres',
        'google.com.mx/imgres',
        'google.com.my/imgres',
        'google.com.na/imgres',
        'google.com.nf/imgres',
        'google.com.ng/imgres',
        'google.com.ni/imgres',
        'google.com.np/imgres',
        'google.com.om/imgres',
        'google.com.pa/imgres',
        'google.com.pe/imgres',
        'google.com.ph/imgres',
        'google.com.pk/imgres',
        'google.com.pr/imgres',
        'google.com.py/imgres',
        'google.com.qa/imgres',
        'google.com.sa/imgres',
        'google.com.sb/imgres',
        'google.com.sg/imgres',
        'google.com.sl/imgres',
        'google.com.sv/imgres',
        'google.com.tj/imgres',
        'google.com.tn/imgres',
        'google.com.tr/imgres',
        'google.com.tw/imgres',
        'google.com.ua/imgres',
        'google.com.uy/imgres',
        'google.com.vc/imgres',
        'google.com.vn/imgres',
        'google.cv/imgres',
        'google.cz/imgres',
        'google.de/imgres',
        'google.dj/imgres',
        'google.dk/imgres',
        'google.dm/imgres',
        'google.dz/imgres',
        'google.ee/imgres',
        'google.es/imgres',
        'google.fi/imgres',
        'google.fm/imgres',
        'google.fr/imgres',
        'google.ga/imgres',
        'google.gd/imgres',
        'google.ge/imgres',
        'google.gf/imgres',
        'google.gg/imgres',
        'google.gl/imgres',
        'google.gm/imgres',
        'google.gp/imgres',
        'google.gr/imgres',
        'google.gy/imgres',
        'google.hn/imgres',
        'google.hr/imgres',
        'google.ht/imgres',
        'google.hu/imgres',
        'google.ie/imgres',
        'google.im/imgres',
        'google.io/imgres',
        'google.iq/imgres',
        'google.is/imgres',
        'google.it/imgres',
        'google.it.ao/imgres',
        'google.je/imgres',
        'google.jo/imgres',
        'google.kg/imgres',
        'google.ki/imgres',
        'google.kz/imgres',
        'google.la/imgres',
        'google.li/imgres',
        'google.lk/imgres',
        'google.lt/imgres',
        'google.lu/imgres',
        'google.lv/imgres',
        'google.md/imgres',
        'google.me/imgres',
        'google.mg/imgres',
        'google.mk/imgres',
        'google.ml/imgres',
        'google.mn/imgres',
        'google.ms/imgres',
        'google.mu/imgres',
        'google.mv/imgres',
        'google.mw/imgres',
        'google.ne/imgres',
        'google.nl/imgres',
        'google.no/imgres',
        'google.nr/imgres',
        'google.nu/imgres',
        'google.pl/imgres',
        'google.pn/imgres',
        'google.ps/imgres',
        'google.pt/imgres',
        'google.ro/imgres',
        'google.rs/imgres',
        'google.ru/imgres',
        'google.rw/imgres',
        'google.sc/imgres',
        'google.se/imgres',
        'google.sh/imgres',
        'google.si/imgres',
        'google.sk/imgres',
        'google.sm/imgres',
        'google.sn/imgres',
        'google.so/imgres',
        'google.st/imgres',
        'google.td/imgres',
        'google.tg/imgres',
        'google.tk/imgres',
        'google.tl/imgres',
        'google.tm/imgres',
        'google.to/imgres',
        'google.tt/imgres',
        'google.us/imgres',
        'google.vg/imgres',
        'google.vu/imgres',
        'images.google.ws',
        'images.google.ac',
        'images.google.ad',
        'images.google.ae',
        'images.google.am',
        'images.google.as',
        'images.google.at',
        'images.google.az',
        'images.google.ba',
        'images.google.be',
        'images.google.bf',
        'images.google.bg',
        'images.google.bi',
        'images.google.bj',
        'images.google.bs',
        'images.google.by',
        'images.google.ca',
        'images.google.cat',
        'images.google.cc',
        'images.google.cd',
        'images.google.cf',
        'images.google.cg',
        'images.google.ch',
        'images.google.ci',
        'images.google.cl',
        'images.google.cm',
        'images.google.cn',
        'images.google.co.bw',
        'images.google.co.ck',
        'images.google.co.cr',
        'images.google.co.id',
        'images.google.co.il',
        'images.google.co.in',
        'images.google.co.jp',
        'images.google.co.ke',
        'images.google.co.kr',
        'images.google.co.ls',
        'images.google.co.ma',
        'images.google.co.mz',
        'images.google.co.nz',
        'images.google.co.th',
        'images.google.co.tz',
        'images.google.co.ug',
        'images.google.co.uk',
        'images.google.co.uz',
        'images.google.co.ve',
        'images.google.co.vi',
        'images.google.co.za',
        'images.google.co.zm',
        'images.google.co.zw',
        'images.google.com',
        'images.google.com.af',
        'images.google.com.ag',
        'images.google.com.ai',
        'images.google.com.ar',
        'images.google.com.au',
        'images.google.com.bd',
        'images.google.com.bh',
        'images.google.com.bn',
        'images.google.com.bo',
        'images.google.com.br',
        'images.google.com.by',
        'images.google.com.bz',
        'images.google.com.co',
        'images.google.com.cu',
        'images.google.com.cy',
        'images.google.com.do',
        'images.google.com.ec',
        'images.google.com.eg',
        'images.google.com.et',
        'images.google.com.fj',
        'images.google.com.gh',
        'images.google.com.gi',
        'images.google.com.gt',
        'images.google.com.hk',
        'images.google.com.jm',
        'images.google.com.kh',
        'images.google.com.kw',
        'images.google.com.lb',
        'images.google.com.lc',
        'images.google.com.ly',
        'images.google.com.mt',
        'images.google.com.mx',
        'images.google.com.my',
        'images.google.com.na',
        'images.google.com.nf',
        'images.google.com.ng',
        'images.google.com.ni',
        'images.google.com.np',
        'images.google.com.om',
        'images.google.com.pa',
        'images.google.com.pe',
        'images.google.com.ph',
        'images.google.com.pk',
        'images.google.com.pr',
        'images.google.com.py',
        'images.google.com.qa',
        'images.google.com.sa',
        'images.google.com.sb',
        'images.google.com.sg',
        'images.google.com.sl',
        'images.google.com.sv',
        'images.google.com.tj',
        'images.google.com.tn',
        'images.google.com.tr',
        'images.google.com.tw',
        'images.google.com.ua',
        'images.google.com.uy',
        'images.google.com.vc',
        'images.google.com.vn',
        'images.google.cv',
        'images.google.cz',
        'images.google.de',
        'images.google.dj',
        'images.google.dk',
        'images.google.dm',
        'images.google.dz',
        'images.google.ee',
        'images.google.es',
        'images.google.fi',
        'images.google.fm',
        'images.google.fr',
        'images.google.ga',
        'images.google.gd',
        'images.google.ge',
        'images.google.gf',
        'images.google.gg',
        'images.google.gl',
        'images.google.gm',
        'images.google.gp',
        'images.google.gr',
        'images.google.gy',
        'images.google.hn',
        'images.google.hr',
        'images.google.ht',
        'images.google.hu',
        'images.google.ie',
        'images.google.im',
        'images.google.io',
        'images.google.iq',
        'images.google.is',
        'images.google.it',
        'images.google.it.ao',
        'images.google.je',
        'images.google.jo',
        'images.google.kg',
        'images.google.ki',
        'images.google.kz',
        'images.google.la',
        'images.google.li',
        'images.google.lk',
        'images.google.lt',
        'images.google.lu',
        'images.google.lv',
        'images.google.md',
        'images.google.me',
        'images.google.mg',
        'images.google.mk',
        'images.google.ml',
        'images.google.mn',
        'images.google.ms',
        'images.google.mu',
        'images.google.mv',
        'images.google.mw',
        'images.google.ne',
        'images.google.nl',
        'images.google.no',
        'images.google.nr',
        'images.google.nu',
        'images.google.pl',
        'images.google.pn',
        'images.google.ps',
        'images.google.pt',
        'images.google.ro',
        'images.google.rs',
        'images.google.ru',
        'images.google.rw',
        'images.google.sc',
        'images.google.se',
        'images.google.sh',
        'images.google.si',
        'images.google.sk',
        'images.google.sm',
        'images.google.sn',
        'images.google.so',
        'images.google.st',
        'images.google.td',
        'images.google.tg',
        'images.google.tk',
        'images.google.tl',
        'images.google.tm',
        'images.google.to',
        'images.google.tt',
        'images.google.us',
        'images.google.vg',
        'images.google.vu',
      ],
      parameters: [
        'q',
      ],
    },
    'ABCsøk': {
      domains: [
        'abcsolk.no',
        'verden.abcsok.no',
      ],
      parameters: [
        'q',
      ],
    },
    'Google Product Search': {
      domains: [
        'google.ac/products',
        'google.ad/products',
        'google.ae/products',
        'google.am/products',
        'google.as/products',
        'google.at/products',
        'google.az/products',
        'google.ba/products',
        'google.be/products',
        'google.bf/products',
        'google.bg/products',
        'google.bi/products',
        'google.bj/products',
        'google.bs/products',
        'google.by/products',
        'google.ca/products',
        'google.cat/products',
        'google.cc/products',
        'google.cd/products',
        'google.cf/products',
        'google.cg/products',
        'google.ch/products',
        'google.ci/products',
        'google.cl/products',
        'google.cm/products',
        'google.cn/products',
        'google.co.bw/products',
        'google.co.ck/products',
        'google.co.cr/products',
        'google.co.id/products',
        'google.co.il/products',
        'google.co.in/products',
        'google.co.jp/products',
        'google.co.ke/products',
        'google.co.kr/products',
        'google.co.ls/products',
        'google.co.ma/products',
        'google.co.mz/products',
        'google.co.nz/products',
        'google.co.th/products',
        'google.co.tz/products',
        'google.co.ug/products',
        'google.co.uk/products',
        'google.co.uz/products',
        'google.co.ve/products',
        'google.co.vi/products',
        'google.co.za/products',
        'google.co.zm/products',
        'google.co.zw/products',
        'google.com/products',
        'google.com.af/products',
        'google.com.ag/products',
        'google.com.ai/products',
        'google.com.ar/products',
        'google.com.au/products',
        'google.com.bd/products',
        'google.com.bh/products',
        'google.com.bn/products',
        'google.com.bo/products',
        'google.com.br/products',
        'google.com.by/products',
        'google.com.bz/products',
        'google.com.co/products',
        'google.com.cu/products',
        'google.com.cy/products',
        'google.com.do/products',
        'google.com.ec/products',
        'google.com.eg/products',
        'google.com.et/products',
        'google.com.fj/products',
        'google.com.gh/products',
        'google.com.gi/products',
        'google.com.gt/products',
        'google.com.hk/products',
        'google.com.jm/products',
        'google.com.kh/products',
        'google.com.kw/products',
        'google.com.lb/products',
        'google.com.lc/products',
        'google.com.ly/products',
        'google.com.mt/products',
        'google.com.mx/products',
        'google.com.my/products',
        'google.com.na/products',
        'google.com.nf/products',
        'google.com.ng/products',
        'google.com.ni/products',
        'google.com.np/products',
        'google.com.om/products',
        'google.com.pa/products',
        'google.com.pe/products',
        'google.com.ph/products',
        'google.com.pk/products',
        'google.com.pr/products',
        'google.com.py/products',
        'google.com.qa/products',
        'google.com.sa/products',
        'google.com.sb/products',
        'google.com.sg/products',
        'google.com.sl/products',
        'google.com.sv/products',
        'google.com.tj/products',
        'google.com.tn/products',
        'google.com.tr/products',
        'google.com.tw/products',
        'google.com.ua/products',
        'google.com.uy/products',
        'google.com.vc/products',
        'google.com.vn/products',
        'google.cv/products',
        'google.cz/products',
        'google.de/products',
        'google.dj/products',
        'google.dk/products',
        'google.dm/products',
        'google.dz/products',
        'google.ee/products',
        'google.es/products',
        'google.fi/products',
        'google.fm/products',
        'google.fr/products',
        'google.ga/products',
        'google.gd/products',
        'google.ge/products',
        'google.gf/products',
        'google.gg/products',
        'google.gl/products',
        'google.gm/products',
        'google.gp/products',
        'google.gr/products',
        'google.gy/products',
        'google.hn/products',
        'google.hr/products',
        'google.ht/products',
        'google.hu/products',
        'google.ie/products',
        'google.im/products',
        'google.io/products',
        'google.iq/products',
        'google.is/products',
        'google.it/products',
        'google.it.ao/products',
        'google.je/products',
        'google.jo/products',
        'google.kg/products',
        'google.ki/products',
        'google.kz/products',
        'google.la/products',
        'google.li/products',
        'google.lk/products',
        'google.lt/products',
        'google.lu/products',
        'google.lv/products',
        'google.md/products',
        'google.me/products',
        'google.mg/products',
        'google.mk/products',
        'google.ml/products',
        'google.mn/products',
        'google.ms/products',
        'google.mu/products',
        'google.mv/products',
        'google.mw/products',
        'google.ne/products',
        'google.nl/products',
        'google.no/products',
        'google.nr/products',
        'google.nu/products',
        'google.pl/products',
        'google.pn/products',
        'google.ps/products',
        'google.pt/products',
        'google.ro/products',
        'google.rs/products',
        'google.ru/products',
        'google.rw/products',
        'google.sc/products',
        'google.se/products',
        'google.sh/products',
        'google.si/products',
        'google.sk/products',
        'google.sm/products',
        'google.sn/products',
        'google.so/products',
        'google.st/products',
        'google.td/products',
        'google.tg/products',
        'google.tk/products',
        'google.tl/products',
        'google.tm/products',
        'google.to/products',
        'google.tt/products',
        'google.us/products',
        'google.vg/products',
        'google.vu/products',
        'google.ws/products',
        'www.google.ac/products',
        'www.google.ad/products',
        'www.google.ae/products',
        'www.google.am/products',
        'www.google.as/products',
        'www.google.at/products',
        'www.google.az/products',
        'www.google.ba/products',
        'www.google.be/products',
        'www.google.bf/products',
        'www.google.bg/products',
        'www.google.bi/products',
        'www.google.bj/products',
        'www.google.bs/products',
        'www.google.by/products',
        'www.google.ca/products',
        'www.google.cat/products',
        'www.google.cc/products',
        'www.google.cd/products',
        'www.google.cf/products',
        'www.google.cg/products',
        'www.google.ch/products',
        'www.google.ci/products',
        'www.google.cl/products',
        'www.google.cm/products',
        'www.google.cn/products',
        'www.google.co.bw/products',
        'www.google.co.ck/products',
        'www.google.co.cr/products',
        'www.google.co.id/products',
        'www.google.co.il/products',
        'www.google.co.in/products',
        'www.google.co.jp/products',
        'www.google.co.ke/products',
        'www.google.co.kr/products',
        'www.google.co.ls/products',
        'www.google.co.ma/products',
        'www.google.co.mz/products',
        'www.google.co.nz/products',
        'www.google.co.th/products',
        'www.google.co.tz/products',
        'www.google.co.ug/products',
        'www.google.co.uk/products',
        'www.google.co.uz/products',
        'www.google.co.ve/products',
        'www.google.co.vi/products',
        'www.google.co.za/products',
        'www.google.co.zm/products',
        'www.google.co.zw/products',
        'www.google.com/products',
        'www.google.com.af/products',
        'www.google.com.ag/products',
        'www.google.com.ai/products',
        'www.google.com.ar/products',
        'www.google.com.au/products',
        'www.google.com.bd/products',
        'www.google.com.bh/products',
        'www.google.com.bn/products',
        'www.google.com.bo/products',
        'www.google.com.br/products',
        'www.google.com.by/products',
        'www.google.com.bz/products',
        'www.google.com.co/products',
        'www.google.com.cu/products',
        'www.google.com.cy/products',
        'www.google.com.do/products',
        'www.google.com.ec/products',
        'www.google.com.eg/products',
        'www.google.com.et/products',
        'www.google.com.fj/products',
        'www.google.com.gh/products',
        'www.google.com.gi/products',
        'www.google.com.gt/products',
        'www.google.com.hk/products',
        'www.google.com.jm/products',
        'www.google.com.kh/products',
        'www.google.com.kw/products',
        'www.google.com.lb/products',
        'www.google.com.lc/products',
        'www.google.com.ly/products',
        'www.google.com.mt/products',
        'www.google.com.mx/products',
        'www.google.com.my/products',
        'www.google.com.na/products',
        'www.google.com.nf/products',
        'www.google.com.ng/products',
        'www.google.com.ni/products',
        'www.google.com.np/products',
        'www.google.com.om/products',
        'www.google.com.pa/products',
        'www.google.com.pe/products',
        'www.google.com.ph/products',
        'www.google.com.pk/products',
        'www.google.com.pr/products',
        'www.google.com.py/products',
        'www.google.com.qa/products',
        'www.google.com.sa/products',
        'www.google.com.sb/products',
        'www.google.com.sg/products',
        'www.google.com.sl/products',
        'www.google.com.sv/products',
        'www.google.com.tj/products',
        'www.google.com.tn/products',
        'www.google.com.tr/products',
        'www.google.com.tw/products',
        'www.google.com.ua/products',
        'www.google.com.uy/products',
        'www.google.com.vc/products',
        'www.google.com.vn/products',
        'www.google.cv/products',
        'www.google.cz/products',
        'www.google.de/products',
        'www.google.dj/products',
        'www.google.dk/products',
        'www.google.dm/products',
        'www.google.dz/products',
        'www.google.ee/products',
        'www.google.es/products',
        'www.google.fi/products',
        'www.google.fm/products',
        'www.google.fr/products',
        'www.google.ga/products',
        'www.google.gd/products',
        'www.google.ge/products',
        'www.google.gf/products',
        'www.google.gg/products',
        'www.google.gl/products',
        'www.google.gm/products',
        'www.google.gp/products',
        'www.google.gr/products',
        'www.google.gy/products',
        'www.google.hn/products',
        'www.google.hr/products',
        'www.google.ht/products',
        'www.google.hu/products',
        'www.google.ie/products',
        'www.google.im/products',
        'www.google.io/products',
        'www.google.iq/products',
        'www.google.is/products',
        'www.google.it/products',
        'www.google.it.ao/products',
        'www.google.je/products',
        'www.google.jo/products',
        'www.google.kg/products',
        'www.google.ki/products',
        'www.google.kz/products',
        'www.google.la/products',
        'www.google.li/products',
        'www.google.lk/products',
        'www.google.lt/products',
        'www.google.lu/products',
        'www.google.lv/products',
        'www.google.md/products',
        'www.google.me/products',
        'www.google.mg/products',
        'www.google.mk/products',
        'www.google.ml/products',
        'www.google.mn/products',
        'www.google.ms/products',
        'www.google.mu/products',
        'www.google.mv/products',
        'www.google.mw/products',
        'www.google.ne/products',
        'www.google.nl/products',
        'www.google.no/products',
        'www.google.nr/products',
        'www.google.nu/products',
        'www.google.pl/products',
        'www.google.pn/products',
        'www.google.ps/products',
        'www.google.pt/products',
        'www.google.ro/products',
        'www.google.rs/products',
        'www.google.ru/products',
        'www.google.rw/products',
        'www.google.sc/products',
        'www.google.se/products',
        'www.google.sh/products',
        'www.google.si/products',
        'www.google.sk/products',
        'www.google.sm/products',
        'www.google.sn/products',
        'www.google.so/products',
        'www.google.st/products',
        'www.google.td/products',
        'www.google.tg/products',
        'www.google.tk/products',
        'www.google.tl/products',
        'www.google.tm/products',
        'www.google.to/products',
        'www.google.tt/products',
        'www.google.us/products',
        'www.google.vg/products',
        'www.google.vu/products',
        'www.google.ws/products',
      ],
      parameters: [
        'q',
      ],
    },
    'DasOertliche': {
      domains: [
        'www.dasoertliche.de',
      ],
      parameters: [
        'kw',
      ],
    },
    'InfoSpace': {
      domains: [
        'infospace.com',
        'dogpile.com',
        'www.dogpile.com',
        'metacrawler.com',
        'webfetch.com',
        'webcrawler.com',
        'search.kiwee.com',
        'isearch.babylon.com',
        'start.facemoods.com',
        'search.magnetic.com',
        'search.searchcompletion.com',
        'clusty.com',
      ],
      parameters: [
        'q',
        's',
      ],
    },
    'Weborama': {
      domains: [
        'www.weborama.com',
      ],
      parameters: [
        'QUERY',
      ],
    },
    'Bluewin': {
      domains: [
        'search.bluewin.ch',
      ],
      parameters: [
        'searchTerm',
      ],
    },
    'Brave': {
      domains: [
        'search.brave.com',
      ],
      parameters: [
        'q',
      ],
    },
    'British Telecommunications': {
      domains: [
        'search.bt.com',
      ],
      parameters: [
        'p',
      ],
    },
    'Neti': {
      domains: [
        'www.neti.ee',
      ],
      parameters: [
        'query',
      ],
    },
    'Nigma': {
      domains: [
        'nigma.ru',
      ],
      parameters: [
        's',
      ],
    },
    'Yahoo! Images': {
      domains: [
        'image.yahoo.cn',
        'images.search.yahoo.com',
      ],
      parameters: [
        'p',
        'q',
      ],
    },
    'Exalead': {
      domains: [
        'www.exalead.fr',
        'www.exalead.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Teoma': {
      domains: [
        'www.teoma.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Needtofind': {
      domains: [
        'ko.search.need2find.com',
      ],
      parameters: [
        'searchfor',
      ],
    },
    'Looksmart': {
      domains: [
        'www.looksmart.com',
      ],
      parameters: [
        'key',
      ],
    },
    'Flyingbird': {
      domains: [
        'inspsearch.com',
        'viview.inspsearch.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Everyclick': {
      domains: [
        'www.everyclick.com',
      ],
      parameters: [
        'keyword',
      ],
    },
    'Wirtualna Polska': {
      domains: [
        'szukaj.wp.pl',
      ],
      parameters: [
        'szukaj',
      ],
    },
    'Toolbarhome': {
      domains: [
        'www.toolbarhome.com',
        'vshare.toolbarhome.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Searchalot': {
      domains: [
        'searchalot.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Yandex': {
      domains: [
        'yandex.ru',
        'yandex.ua',
        'yandex.com',
        'yandex.by',
        'www.yandex.ru',
        'www.yandex.ua',
        'www.yandex.com',
        'www.yandex.by',
        'clck.yandex.ru',
        'clck.yandex.ua',
        'clck.yandex.com',
        'clck.yandex.by',
      ],
      parameters: [
        'text',
      ],
    },
    'Indeed': {
      domains: [
        'de.indeed.com',
        'at.indeed.com',
        'fr.indeed.com',
        'it.indeed.com',
        'ch.indeed.com',
        'au.indeed.com',
      ],
    },
    'canoe.ca': {
      domains: [
        'web.canoe.ca',
      ],
      parameters: [
        'q',
      ],
    },
    'Compuserve': {
      domains: [
        'websearch.cs.com',
      ],
      parameters: [
        'query',
      ],
    },
    'Blogdigger': {
      domains: [
        'www.blogdigger.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Startpagina': {
      domains: [
        'startgoogle.startpagina.nl',
      ],
      parameters: [
        'q',
      ],
    },
    'eo': {
      domains: [
        'eo.st',
      ],
      parameters: [
        'x_query',
      ],
    },
    'Zhongsou': {
      domains: [
        'p.zhongsou.com',
      ],
      parameters: [
        'w',
      ],
    },
    'La Toile Du Quebec Via Google': {
      domains: [
        'www.toile.com',
        'web.toile.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Paperball': {
      domains: [
        'www.paperball.de',
      ],
      parameters: [
        'q',
      ],
    },
    'Arianna': {
      domains: [
        'arianna.libero.it',
        'www.arianna.com',
      ],
      parameters: [
        'query',
      ],
    },
    'StepStone': {
      domains: [
        'www.stepstone.de',
        'www.stepstone.at',
        'www.stepstone.be',
        'www.stepstone.fr',
        'www.stepstone.nl',
        'www.stepstone.dk',
        'www.stepstone.se',
      ],
    },
    'Jungle Spider': {
      domains: [
        'www.jungle-spider.de',
      ],
      parameters: [
        'q',
      ],
    },
    'PeoplePC': {
      domains: [
        'search.peoplepc.com',
      ],
      parameters: [
        'q',
      ],
    },
    'The Smart Search': {
      domains: [
        'thesmartsearch.net',
        'www.thesmartsearch.net',
      ],
      parameters: [
        'q',
      ],
    },
    'MetaCrawler.de': {
      domains: [
        's1.metacrawler.de',
        's2.metacrawler.de',
        's3.metacrawler.de',
      ],
      parameters: [
        'qry',
      ],
    },
    'Orange': {
      domains: [
        'busca.orange.es',
        'search.orange.co.uk',
        'lemoteur.orange.fr',
      ],
      parameters: [
        'q',
        'kw',
      ],
    },
    'Gule Sider': {
      domains: [
        'www.gulesider.no',
      ],
      parameters: [
        'q',
      ],
    },
    'I.ua': {
      domains: [
        'search.i.ua',
      ],
      parameters: [
        'q',
      ],
    },
    'Francite': {
      domains: [
        'recherche.francite.com',
      ],
      parameters: [
        'name',
      ],
    },
    'Ask Toolbar': {
      domains: [
        'search.tb.ask.com',
      ],
      parameters: [
        'searchfor',
      ],
    },
    'Tut.by': {
      domains: [
        'search.tut.by',
      ],
      parameters: [
        'query',
      ],
    },
    'Trusted-Search': {
      domains: [
        'www.trusted--search.com',
      ],
      parameters: [
        'w',
      ],
    },
    'goo': {
      domains: [
        'search.goo.ne.jp',
        'ocnsearch.goo.ne.jp',
      ],
      parameters: [
        'MT',
      ],
    },
    'Fast Browser Search': {
      domains: [
        'www.fastbrowsersearch.com',
      ],
      parameters: [
        'q',
      ],
    },
    'kununu': {
      domains: [
        'kununu.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Volny': {
      domains: [
        'web.volny.cz',
      ],
      parameters: [
        'search',
      ],
    },
    'Icerockeet': {
      domains: [
        'blogs.icerocket.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Terra': {
      domains: [
        'buscador.terra.es',
        'buscador.terra.cl',
        'buscador.terra.com.br',
      ],
      parameters: [
        'query',
      ],
    },
    'Amazon': {
      domains: [
        'amazon.com',
        'www.amazon.com',
      ],
      parameters: [
        'keywords',
      ],
    },
    'Onet': {
      domains: [
        'szukaj.onet.pl',
      ],
      parameters: [
        'qt',
      ],
    },
    'Digg': {
      domains: [
        'digg.com',
      ],
      parameters: [
        's',
      ],
    },
    'Abacho': {
      domains: [
        'www.abacho.de',
        'www.abacho.com',
        'www.abacho.co.uk',
        'www.se.abacho.com',
        'www.tr.abacho.com',
        'www.abacho.at',
        'www.abacho.fr',
        'www.abacho.es',
        'www.abacho.ch',
        'www.abacho.it',
      ],
      parameters: [
        'q',
      ],
    },
    'maailm': {
      domains: [
        'www.maailm.com',
      ],
      parameters: [
        'tekst',
      ],
    },
    'Flix': {
      domains: [
        'www.flix.de',
      ],
      parameters: [
        'keyword',
      ],
    },
    'Inbox.com': {
      domains: [
        'inbox.com/search/',
      ],
      parameters: [
        'q',
      ],
    },
    'Freenet': {
      domains: [
        'suche.freenet.de',
      ],
      parameters: [
        'query',
        'Keywords',
      ],
    },
    'Suchnase': {
      domains: [
        'www.suchnase.de',
      ],
      parameters: [
        'q',
      ],
    },
    'Dodo': {
      domains: [
        'google.dodo.com.au',
      ],
      parameters: [
        'q',
      ],
    },
    'Google Blogsearch': {
      domains: [
        'blogsearch.google.ac',
        'blogsearch.google.ad',
        'blogsearch.google.ae',
        'blogsearch.google.am',
        'blogsearch.google.as',
        'blogsearch.google.at',
        'blogsearch.google.az',
        'blogsearch.google.ba',
        'blogsearch.google.be',
        'blogsearch.google.bf',
        'blogsearch.google.bg',
        'blogsearch.google.bi',
        'blogsearch.google.bj',
        'blogsearch.google.bs',
        'blogsearch.google.by',
        'blogsearch.google.ca',
        'blogsearch.google.cat',
        'blogsearch.google.cc',
        'blogsearch.google.cd',
        'blogsearch.google.cf',
        'blogsearch.google.cg',
        'blogsearch.google.ch',
        'blogsearch.google.ci',
        'blogsearch.google.cl',
        'blogsearch.google.cm',
        'blogsearch.google.cn',
        'blogsearch.google.co.bw',
        'blogsearch.google.co.ck',
        'blogsearch.google.co.cr',
        'blogsearch.google.co.id',
        'blogsearch.google.co.il',
        'blogsearch.google.co.in',
        'blogsearch.google.co.jp',
        'blogsearch.google.co.ke',
        'blogsearch.google.co.kr',
        'blogsearch.google.co.ls',
        'blogsearch.google.co.ma',
        'blogsearch.google.co.mz',
        'blogsearch.google.co.nz',
        'blogsearch.google.co.th',
        'blogsearch.google.co.tz',
        'blogsearch.google.co.ug',
        'blogsearch.google.co.uk',
        'blogsearch.google.co.uz',
        'blogsearch.google.co.ve',
        'blogsearch.google.co.vi',
        'blogsearch.google.co.za',
        'blogsearch.google.co.zm',
        'blogsearch.google.co.zw',
        'blogsearch.google.com',
        'blogsearch.google.com.af',
        'blogsearch.google.com.ag',
        'blogsearch.google.com.ai',
        'blogsearch.google.com.ar',
        'blogsearch.google.com.au',
        'blogsearch.google.com.bd',
        'blogsearch.google.com.bh',
        'blogsearch.google.com.bn',
        'blogsearch.google.com.bo',
        'blogsearch.google.com.br',
        'blogsearch.google.com.by',
        'blogsearch.google.com.bz',
        'blogsearch.google.com.co',
        'blogsearch.google.com.cu',
        'blogsearch.google.com.cy',
        'blogsearch.google.com.do',
        'blogsearch.google.com.ec',
        'blogsearch.google.com.eg',
        'blogsearch.google.com.et',
        'blogsearch.google.com.fj',
        'blogsearch.google.com.gh',
        'blogsearch.google.com.gi',
        'blogsearch.google.com.gt',
        'blogsearch.google.com.hk',
        'blogsearch.google.com.jm',
        'blogsearch.google.com.kh',
        'blogsearch.google.com.kw',
        'blogsearch.google.com.lb',
        'blogsearch.google.com.lc',
        'blogsearch.google.com.ly',
        'blogsearch.google.com.mt',
        'blogsearch.google.com.mx',
        'blogsearch.google.com.my',
        'blogsearch.google.com.na',
        'blogsearch.google.com.nf',
        'blogsearch.google.com.ng',
        'blogsearch.google.com.ni',
        'blogsearch.google.com.np',
        'blogsearch.google.com.om',
        'blogsearch.google.com.pa',
        'blogsearch.google.com.pe',
        'blogsearch.google.com.ph',
        'blogsearch.google.com.pk',
        'blogsearch.google.com.pr',
        'blogsearch.google.com.py',
        'blogsearch.google.com.qa',
        'blogsearch.google.com.sa',
        'blogsearch.google.com.sb',
        'blogsearch.google.com.sg',
        'blogsearch.google.com.sl',
        'blogsearch.google.com.sv',
        'blogsearch.google.com.tj',
        'blogsearch.google.com.tn',
        'blogsearch.google.com.tr',
        'blogsearch.google.com.tw',
        'blogsearch.google.com.ua',
        'blogsearch.google.com.uy',
        'blogsearch.google.com.vc',
        'blogsearch.google.com.vn',
        'blogsearch.google.cv',
        'blogsearch.google.cz',
        'blogsearch.google.de',
        'blogsearch.google.dj',
        'blogsearch.google.dk',
        'blogsearch.google.dm',
        'blogsearch.google.dz',
        'blogsearch.google.ee',
        'blogsearch.google.es',
        'blogsearch.google.fi',
        'blogsearch.google.fm',
        'blogsearch.google.fr',
        'blogsearch.google.ga',
        'blogsearch.google.gd',
        'blogsearch.google.ge',
        'blogsearch.google.gf',
        'blogsearch.google.gg',
        'blogsearch.google.gl',
        'blogsearch.google.gm',
        'blogsearch.google.gp',
        'blogsearch.google.gr',
        'blogsearch.google.gy',
        'blogsearch.google.hn',
        'blogsearch.google.hr',
        'blogsearch.google.ht',
        'blogsearch.google.hu',
        'blogsearch.google.ie',
        'blogsearch.google.im',
        'blogsearch.google.io',
        'blogsearch.google.iq',
        'blogsearch.google.is',
        'blogsearch.google.it',
        'blogsearch.google.it.ao',
        'blogsearch.google.je',
        'blogsearch.google.jo',
        'blogsearch.google.kg',
        'blogsearch.google.ki',
        'blogsearch.google.kz',
        'blogsearch.google.la',
        'blogsearch.google.li',
        'blogsearch.google.lk',
        'blogsearch.google.lt',
        'blogsearch.google.lu',
        'blogsearch.google.lv',
        'blogsearch.google.md',
        'blogsearch.google.me',
        'blogsearch.google.mg',
        'blogsearch.google.mk',
        'blogsearch.google.ml',
        'blogsearch.google.mn',
        'blogsearch.google.ms',
        'blogsearch.google.mu',
        'blogsearch.google.mv',
        'blogsearch.google.mw',
        'blogsearch.google.ne',
        'blogsearch.google.nl',
        'blogsearch.google.no',
        'blogsearch.google.nr',
        'blogsearch.google.nu',
        'blogsearch.google.pl',
        'blogsearch.google.pn',
        'blogsearch.google.ps',
        'blogsearch.google.pt',
        'blogsearch.google.ro',
        'blogsearch.google.rs',
        'blogsearch.google.ru',
        'blogsearch.google.rw',
        'blogsearch.google.sc',
        'blogsearch.google.se',
        'blogsearch.google.sh',
        'blogsearch.google.si',
        'blogsearch.google.sk',
        'blogsearch.google.sm',
        'blogsearch.google.sn',
        'blogsearch.google.so',
        'blogsearch.google.st',
        'blogsearch.google.td',
        'blogsearch.google.tg',
        'blogsearch.google.tk',
        'blogsearch.google.tl',
        'blogsearch.google.tm',
        'blogsearch.google.to',
        'blogsearch.google.tt',
        'blogsearch.google.us',
        'blogsearch.google.vg',
        'blogsearch.google.vu',
        'blogsearch.google.ws',
      ],
      parameters: [
        'q',
      ],
    },
    'Poisk.ru': {
      domains: [
        'poisk.ru',
      ],
      parameters: [
        'q',
      ],
    },
    'Sharelook': {
      domains: [
        'www.sharelook.fr',
      ],
      parameters: [
        'keyword',
      ],
    },
    'Finderoo': {
      domains: [
        'www.finderoo.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Najdi': {
      domains: [
        'www.najdi.si',
      ],
      parameters: [
        'q',
      ],
    },
    'Picsearch': {
      domains: [
        'www.picsearch.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Mail.ru': {
      domains: [
        'mail.ru',
        'm.mail.ru',
        'go.mail.ru',
      ],
      parameters: [
        'q',
      ],
    },
    'Alexa': {
      domains: [
        'alexa.com',
        'search.toolbars.alexa.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Metager': {
      domains: [
        'meta.rrzn.uni-hannover.de',
        'www.metager.de',
      ],
      parameters: [
        'eingabe',
      ],
    },
    'Technorati': {
      domains: [
        'technorati.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Globososo': {
      domains: [
        'searches.globososo.com',
        'search.globososo.com',
      ],
      parameters: [
        'q',
      ],
    },
    'WWW': {
      domains: [
        'search.www.ee',
      ],
      parameters: [
        'query',
      ],
    },
    'Trouvez.com': {
      domains: [
        'www.trouvez.com',
      ],
      parameters: [
        'query',
      ],
    },
    'IXquick': {
      domains: [
        'ixquick.com',
        'www.eu.ixquick.com',
        'ixquick.de',
        'www.ixquick.de',
        'us.ixquick.com',
        's1.us.ixquick.com',
        's2.us.ixquick.com',
        's3.us.ixquick.com',
        's4.us.ixquick.com',
        's5.us.ixquick.com',
        'eu.ixquick.com',
        's8-eu.ixquick.com',
        's1-eu.ixquick.de',
      ],
      parameters: [
        'query',
      ],
    },
    'Naver Images': {
      domains: [
        'image.search.naver.com',
        'imagesearch.naver.com',
      ],
      parameters: [
        'query',
      ],
    },
    'Zapmeta': {
      domains: [
        'www.zapmeta.com',
        'www.zapmeta.nl',
        'www.zapmeta.de',
        'uk.zapmeta.com',
      ],
      parameters: [
        'q',
        'query',
      ],
    },
    'Yippy': {
      domains: [
        'search.yippy.com',
      ],
      parameters: [
        'q',
        'query',
      ],
    },
    'Clix': {
      domains: [
        'pesquisa.clix.pt',
      ],
      parameters: [
        'question',
      ],
    },
    'Walhello': {
      domains: [
        'www.walhello.info',
        'www.walhello.com',
        'www.walhello.de',
        'www.walhello.nl',
      ],
      parameters: [
        'key',
      ],
    },
    'Startsiden': {
      domains: [
        'www.startsiden.no',
      ],
      parameters: [
        'q',
      ],
    },
    'Skynet': {
      domains: [
        'www.skynet.be',
      ],
      parameters: [
        'q',
      ],
    },
    'Searchy': {
      domains: [
        'www.searchy.co.uk',
      ],
      parameters: [
        'q',
      ],
    },
    'Findwide': {
      domains: [
        'search.findwide.com',
      ],
      parameters: [
        'k',
      ],
    },
    'WebSearch': {
      domains: [
        'www.websearch.com',
      ],
      parameters: [
        'qkw',
        'q',
      ],
    },
    'Rambler': {
      domains: [
        'nova.rambler.ru',
      ],
      parameters: [
        'query',
        'words',
      ],
    },
    'Latne': {
      domains: [
        'www.latne.lv',
      ],
      parameters: [
        'q',
      ],
    },
    'MySearch': {
      domains: [
        'mysearch.com',
        'www.mysearch.com',
        'ms114.mysearch.com',
        'ms146.mysearch.com',
        'kf.mysearch.myway.com',
        'ki.mysearch.myway.com',
        'search.myway.com',
        'search.mywebsearch.com',
      ],
      parameters: [
        'searchfor',
        'searchFor',
      ],
    },
    'Cuil': {
      domains: [
        'www.cuil.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Tixuma': {
      domains: [
        'www.tixuma.de',
      ],
      parameters: [
        'sc',
      ],
    },
    'Sapo': {
      domains: [
        'pesquisa.sapo.pt',
      ],
      parameters: [
        'q',
      ],
    },
    'Gnadenmeer': {
      domains: [
        'www.gnadenmeer.de',
      ],
      parameters: [
        'keyword',
      ],
    },
    'Lilo': {
      domains: [
        'search.lilo.org',
      ],
      parameters: [
        'q',
      ],
    },
    'Naver': {
      domains: [
        'search.naver.com',
      ],
      parameters: [
        'query',
      ],
    },
    'Zoeken': {
      domains: [
        'www.zoeken.nl',
      ],
      parameters: [
        'q',
      ],
    },
    'Yam': {
      domains: [
        'search.yam.com',
      ],
      parameters: [
        'k',
      ],
    },
    'Eniro': {
      domains: [
        'www.eniro.se',
      ],
      parameters: [
        'q',
        'search_word',
      ],
    },
    'APOLL07': {
      domains: [
        'apollo7.de',
      ],
      parameters: [
        'query',
      ],
    },
    'Biglobe': {
      domains: [
        'cgi.search.biglobe.ne.jp',
      ],
      parameters: [
        'q',
      ],
    },
    'Mozbot': {
      domains: [
        'www.mozbot.fr',
        'www.mozbot.co.uk',
        'www.mozbot.com',
      ],
      parameters: [
        'q',
      ],
    },
    'ICQ': {
      domains: [
        'www.icq.com',
        'search.icq.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Baidu': {
      domains: [
        'www.baidu.com',
        'www1.baidu.com',
        'zhidao.baidu.com',
        'tieba.baidu.com',
        'news.baidu.com',
        'web.gougou.com',
        'm.baidu.com',
      ],
      parameters: [
        'wd',
        'word',
        'kw',
        'k',
      ],
    },
    'Conduit': {
      domains: [
        'search.conduit.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Vindex': {
      domains: [
        'www.vindex.nl',
        'search.vindex.nl',
      ],
      parameters: [
        'search_for',
      ],
    },
    'Babylon': {
      domains: [
        'search.babylon.com',
        'searchassist.babylon.com',
      ],
      parameters: [
        'q',
      ],
    },
    'TrovaRapido': {
      domains: [
        'www.trovarapido.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Winamp': {
      domains: [
        'search.winamp.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Suchmaschine.com': {
      domains: [
        'www.suchmaschine.com',
      ],
      parameters: [
        'suchstr',
      ],
    },
    'Lycos': {
      domains: [
        'search.lycos.com',
        'www.lycos.com',
        'lycos.com',
      ],
      parameters: [
        'query',
      ],
    },
    'Vinden': {
      domains: [
        'www.vinden.nl',
      ],
      parameters: [
        'q',
      ],
    },
    'Altavista': {
      domains: [
        'www.altavista.com',
        'search.altavista.com',
        'listings.altavista.com',
        'altavista.de',
        'altavista.fr',
        'be-nl.altavista.com',
        'be-fr.altavista.com',
      ],
      parameters: [
        'q',
      ],
    },
    'dmoz': {
      domains: [
        'dmoz.org',
        'editors.dmoz.org',
      ],
      parameters: [
        'q',
      ],
    },
    'Ecosia': {
      domains: [
        'ecosia.org',
      ],
      parameters: [
        'q',
      ],
    },
    'Maxwebsearch': {
      domains: [
        'maxwebsearch.com',
      ],
      parameters: [
        'query',
      ],
    },
    'Euroseek': {
      domains: [
        'www.euroseek.com',
      ],
      parameters: [
        'string',
      ],
    },
    'Qwant': {
      domains: [
        'www.qwant.com',
        'lite.qwant.com',
      ],
      parameters: [
        'q',
      ],
    },
    'X-recherche': {
      domains: [
        'www.x-recherche.com',
      ],
      parameters: [
        'MOTS',
      ],
    },
    'Yandex Images': {
      domains: [
        'images.yandex.ru',
        'images.yandex.ua',
        'images.yandex.com',
        'images.yandex.by',
      ],
      parameters: [
        'text',
      ],
    },
    'GMX': {
      domains: [
        'suche.gmx.net',
      ],
      parameters: [
        'su',
      ],
    },
    'Daemon search': {
      domains: [
        'daemon-search.com',
        'my.daemon-search.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Meta.ua': {
      domains: [
        'meta.ua',
      ],
      parameters: [
        'q',
      ],
    },
    'Shenma': {
      domains: [
        'so.m.sm.cn',
        'yz.m.sm.cn',
        'm.sm.cn',
        'quark.sm.cn',
        'm.sp.sm.cn',
        'm.yz2.sm.cn',
        'm.yz.sm.cn',
      ],
      parameters: [
        'q',
      ],
    },
    'Firstfind': {
      domains: [
        'www.firstsfind.com',
      ],
      parameters: [
        'qry',
      ],
    },
    'Crawler': {
      domains: [
        'www.crawler.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Holmes': {
      domains: [
        'holmes.ge',
      ],
      parameters: [
        'q',
      ],
    },
    'Charter': {
      domains: [
        'www.charter.net',
      ],
      parameters: [
        'q',
      ],
    },
    'Ilse': {
      domains: [
        'www.ilse.nl',
      ],
      parameters: [
        'search_for',
      ],
    },
    'earthlink': {
      domains: [
        'search.earthlink.net',
      ],
      parameters: [
        'q',
      ],
    },
    'Qualigo': {
      domains: [
        'www.qualigo.at',
        'www.qualigo.ch',
        'www.qualigo.de',
        'www.qualigo.nl',
      ],
      parameters: [
        'q',
      ],
    },
    'El Mundo': {
      domains: [
        'ariadna.elmundo.es',
      ],
      parameters: [
        'q',
      ],
    },
    'Metager2': {
      domains: [
        'metager2.de',
      ],
      parameters: [
        'q',
      ],
    },
    'Forestle': {
      domains: [
        'forestle.org',
        'www.forestle.org',
        'forestle.mobi',
      ],
      parameters: [
        'q',
      ],
    },
    'Search.ch': {
      domains: [
        'www.search.ch',
      ],
      parameters: [
        'q',
      ],
    },
    'Liveinternet': {
      domains: [
        'liveinternet.ru',
      ],
      parameters: [
        'q',
      ],
    },
    'Meinestadt': {
      domains: [
        'www.meinestadt.de',
      ],
      parameters: [
        'words',
      ],
    },
    'Freshweather': {
      domains: [
        'www.fresh-weather.com',
      ],
      parameters: [
        'q',
      ],
    },
    'AllTheWeb': {
      domains: [
        'www.alltheweb.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Coccoc': {
      domains: [
        'coccoc.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Snapdo': {
      domains: [
        'search.snapdo.com',
      ],
      parameters: [
        'q',
      ],
    },
    'UKR.net': {
      domains: [
        'search.ukr.net',
      ],
      parameters: [
        'q',
      ],
    },
    'Zoek': {
      domains: [
        'www3.zoek.nl',
      ],
      parameters: [
        'q',
      ],
    },
    'Daum': {
      domains: [
        'search.daum.net',
      ],
      parameters: [
        'q',
      ],
    },
    'Marktplaats': {
      domains: [
        'www.marktplaats.nl',
      ],
      parameters: [
        'query',
      ],
    },
    'suche.info': {
      domains: [
        'suche.info',
      ],
      parameters: [
        'q',
      ],
    },
    'Google News': {
      domains: [
        'news.google.ac',
        'news.google.ad',
        'news.google.ae',
        'news.google.am',
        'news.google.as',
        'news.google.at',
        'news.google.az',
        'news.google.ba',
        'news.google.be',
        'news.google.bf',
        'news.google.bg',
        'news.google.bi',
        'news.google.bj',
        'news.google.bs',
        'news.google.by',
        'news.google.ca',
        'news.google.cat',
        'news.google.cc',
        'news.google.cd',
        'news.google.cf',
        'news.google.cg',
        'news.google.ch',
        'news.google.ci',
        'news.google.cl',
        'news.google.cm',
        'news.google.cn',
        'news.google.co.bw',
        'news.google.co.ck',
        'news.google.co.cr',
        'news.google.co.id',
        'news.google.co.il',
        'news.google.co.in',
        'news.google.co.jp',
        'news.google.co.ke',
        'news.google.co.kr',
        'news.google.co.ls',
        'news.google.co.ma',
        'news.google.co.mz',
        'news.google.co.nz',
        'news.google.co.th',
        'news.google.co.tz',
        'news.google.co.ug',
        'news.google.co.uk',
        'news.google.co.uz',
        'news.google.co.ve',
        'news.google.co.vi',
        'news.google.co.za',
        'news.google.co.zm',
        'news.google.co.zw',
        'news.google.com',
        'news.google.com.af',
        'news.google.com.ag',
        'news.google.com.ai',
        'news.google.com.ar',
        'news.google.com.au',
        'news.google.com.bd',
        'news.google.com.bh',
        'news.google.com.bn',
        'news.google.com.bo',
        'news.google.com.br',
        'news.google.com.by',
        'news.google.com.bz',
        'news.google.com.co',
        'news.google.com.cu',
        'news.google.com.cy',
        'news.google.com.do',
        'news.google.com.ec',
        'news.google.com.eg',
        'news.google.com.et',
        'news.google.com.fj',
        'news.google.com.gh',
        'news.google.com.gi',
        'news.google.com.gt',
        'news.google.com.hk',
        'news.google.com.jm',
        'news.google.com.kh',
        'news.google.com.kw',
        'news.google.com.lb',
        'news.google.com.lc',
        'news.google.com.ly',
        'news.google.com.mt',
        'news.google.com.mx',
        'news.google.com.my',
        'news.google.com.na',
        'news.google.com.nf',
        'news.google.com.ng',
        'news.google.com.ni',
        'news.google.com.np',
        'news.google.com.om',
        'news.google.com.pa',
        'news.google.com.pe',
        'news.google.com.ph',
        'news.google.com.pk',
        'news.google.com.pr',
        'news.google.com.py',
        'news.google.com.qa',
        'news.google.com.sa',
        'news.google.com.sb',
        'news.google.com.sg',
        'news.google.com.sl',
        'news.google.com.sv',
        'news.google.com.tj',
        'news.google.com.tn',
        'news.google.com.tr',
        'news.google.com.tw',
        'news.google.com.ua',
        'news.google.com.uy',
        'news.google.com.vc',
        'news.google.com.vn',
        'news.google.cv',
        'news.google.cz',
        'news.google.de',
        'news.google.dj',
        'news.google.dk',
        'news.google.dm',
        'news.google.dz',
        'news.google.ee',
        'news.google.es',
        'news.google.fi',
        'news.google.fm',
        'news.google.fr',
        'news.google.ga',
        'news.google.gd',
        'news.google.ge',
        'news.google.gf',
        'news.google.gg',
        'news.google.gl',
        'news.google.gm',
        'news.google.gp',
        'news.google.gr',
        'news.google.gy',
        'news.google.hn',
        'news.google.hr',
        'news.google.ht',
        'news.google.hu',
        'news.google.ie',
        'news.google.im',
        'news.google.io',
        'news.google.iq',
        'news.google.is',
        'news.google.it',
        'news.google.it.ao',
        'news.google.je',
        'news.google.jo',
        'news.google.kg',
        'news.google.ki',
        'news.google.kz',
        'news.google.la',
        'news.google.li',
        'news.google.lk',
        'news.google.lt',
        'news.google.lu',
        'news.google.lv',
        'news.google.md',
        'news.google.me',
        'news.google.mg',
        'news.google.mk',
        'news.google.ml',
        'news.google.mn',
        'news.google.ms',
        'news.google.mu',
        'news.google.mv',
        'news.google.mw',
        'news.google.ne',
        'news.google.nl',
        'news.google.no',
        'news.google.nr',
        'news.google.nu',
        'news.google.pl',
        'news.google.pn',
        'news.google.ps',
        'news.google.pt',
        'news.google.ro',
        'news.google.rs',
        'news.google.ru',
        'news.google.rw',
        'news.google.sc',
        'news.google.se',
        'news.google.sh',
        'news.google.si',
        'news.google.sk',
        'news.google.sm',
        'news.google.sn',
        'news.google.so',
        'news.google.st',
        'news.google.td',
        'news.google.tg',
        'news.google.tk',
        'news.google.tl',
        'news.google.tm',
        'news.google.to',
        'news.google.tt',
        'news.google.us',
        'news.google.vg',
        'news.google.vu',
        'news.google.ws',
      ],
      parameters: [
        'q',
      ],
    },
    'Zoohoo': {
      domains: [
        'zoohoo.cz',
      ],
      parameters: [
        'q',
      ],
    },
    'Seznam': {
      domains: [
        'search.seznam.cz',
      ],
      parameters: [
        'q',
      ],
    },
    'Online.no': {
      domains: [
        'online.no',
      ],
      parameters: [
        'q',
      ],
    },
    'Eurip': {
      domains: [
        'www.eurip.com',
      ],
      parameters: [
        'q',
      ],
    },
    'all.by': {
      domains: [
        'all.by',
      ],
      parameters: [
        'query',
      ],
    },
    'Road Runner Search': {
      domains: [
        'search.rr.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Opplysningen 1881': {
      domains: [
        'www.1881.no',
      ],
      parameters: [
        'Query',
      ],
    },
    'YouGoo': {
      domains: [
        'www.yougoo.fr',
      ],
      parameters: [
        'q',
      ],
    },
    'Bing Images': {
      domains: [
        'bing.com/images/search',
        'www.bing.com/images/search',
      ],
      parameters: [
        'q',
        'Q',
      ],
    },
    'Geona': {
      domains: [
        'geona.net',
      ],
      parameters: [
        'q',
      ],
    },
    'Nate': {
      domains: [
        'search.nate.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Search This': {
      domains: [
        'www.searchthis.com',
      ],
      parameters: [
        'q',
      ],
    },
    'DuckDuckGo': {
      domains: [
        'duckduckgo.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Monster': {
      domains: [
        'www.monster.be',
        'www.monster.cz',
        'www.monster.de',
        'www.monster.fi',
        'www.monster.fr',
        'www.monster.ie',
        'www.monster.it',
        'www.monster.lu',
        'www.monster.ch',
        'www.monster.co.uk',
      ],
      parameters: [
        'q',
      ],
    },
    'Hotbot': {
      domains: [
        'www.hotbot.com',
      ],
      parameters: [
        'query',
      ],
    },
    'Kvasir': {
      domains: [
        'www.kvasir.no',
      ],
      parameters: [
        'q',
      ],
    },
    'Austronaut': {
      domains: [
        'www2.austronaut.at',
        'www1.astronaut.at',
      ],
      parameters: [
        'q',
      ],
    },
    'SoSoDesk': {
      domains: [
        'sosodesktop.com',
        'search.sosodesktop.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Excite': {
      domains: [
        'search.excite.it',
        'search.excite.fr',
        'search.excite.de',
        'search.excite.co.uk',
        'serach.excite.es',
        'search.excite.nl',
        'msxml.excite.com',
        'www.excite.co.jp',
      ],
      parameters: [
        'q',
        'search',
      ],
    },
    '1&1': {
      domains: [
        'search.1and1.com',
      ],
      parameters: [
        'q',
      ],
    },
    'qip': {
      domains: [
        'search.qip.ru',
      ],
      parameters: [
        'query',
      ],
    },
    'Certified-Toolbar': {
      domains: [
        'search.certified-toolbar.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Yahoo!': {
      domains: [
        'search.yahoo.com',
        'yahoo.com',
        'ar.search.yahoo.com',
        'ar.yahoo.com',
        'au.search.yahoo.com',
        'au.yahoo.com',
        'br.search.yahoo.com',
        'br.yahoo.com',
        'ca.search.yahoo.com',
        'ca.yahoo.com',
        'cade.searchde.yahoo.com',
        'cade.yahoo.com',
        'chinese.searchinese.yahoo.com',
        'chinese.yahoo.com',
        'cn.search.yahoo.com',
        'cn.yahoo.com',
        'de.search.yahoo.com',
        'de.yahoo.com',
        'dk.search.yahoo.com',
        'dk.yahoo.com',
        'es.search.yahoo.com',
        'es.yahoo.com',
        'espanol.searchpanol.yahoo.com',
        'espanol.yahoo.com',
        'fr.search.yahoo.com',
        'fr.yahoo.com',
        'hk.search.yahoo.com',
        'hk.yahoo.com',
        'ie.search.yahoo.com',
        'ie.yahoo.com',
        'in.search.yahoo.com',
        'in.yahoo.com',
        'it.search.yahoo.com',
        'it.yahoo.com',
        'kr.search.yahoo.com',
        'kr.yahoo.com',
        'mx.search.yahoo.com',
        'mx.yahoo.com',
        'no.search.yahoo.com',
        'no.yahoo.com',
        'nz.search.yahoo.com',
        'nz.yahoo.com',
        'one.cn.yahoo.com',
        'one.searchn.yahoo.com',
        'qc.search.yahoo.com',
        'qc.yahoo.com',
        'ru.search.yahoo.com',
        'ru.yahoo.com',
        'se.search.yahoo.com',
        'se.yahoo.com',
        'search.searcharch.yahoo.com',
        'tw.search.yahoo.com',
        'tw.yahoo.com',
        'uk.search.yahoo.com',
        'uk.yahoo.com',
        'us.search.yahoo.com',
        'us.yahoo.com',
        'www.yahoo.co.jp',
        'search.yahoo.co.jp',
        'www.cercato.it',
        'search.offerbox.com',
        'ys.mirostart.com',
      ],
      parameters: [
        'p',
        'q',
      ],
    },
    'URL.ORGanizier': {
      domains: [
        'www.url.org',
      ],
      parameters: [
        'q',
      ],
    },
    'Witch': {
      domains: [
        'www.witch.de',
      ],
      parameters: [
        'search',
      ],
    },
    'Mister Wong': {
      domains: [
        'www.mister-wong.com',
        'www.mister-wong.de',
      ],
      parameters: [
        'Keywords',
      ],
    },
    'Aport': {
      domains: [
        'sm.aport.ru',
      ],
      parameters: [
        'r',
      ],
    },
    'Web.de': {
      domains: [
        'suche.web.de',
      ],
      parameters: [
        'su',
      ],
    },
    'Ask': {
      domains: [
        'ask.com',
        'www.ask.com',
        'web.ask.com',
        'int.ask.com',
        'mws.ask.com',
        'uk.ask.com',
        'images.ask.com',
        'ask.reference.com',
        'www.askkids.com',
        'iwon.ask.com',
        'www.ask.co.uk',
        'www.qbyrd.com',
        'search-results.com',
        'uk.search-results.com',
        'www.search-results.com',
        'int.search-results.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Centrum': {
      domains: [
        'serach.centrum.cz',
        'morfeo.centrum.cz',
      ],
      parameters: [
        'q',
      ],
    },
    'Bing': {
      domains: [
        'bing.com',
        'www.bing.com',
        'msnbc.msn.com',
        'dizionario.it.msn.com',
        'cc.bingj.com',
        'm.bing.com',
      ],
      parameters: [
        'q',
        'Q',
      ],
    },
    'Google Video': {
      domains: [
        'video.google.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Delfi': {
      domains: [
        'otsing.delfi.ee',
      ],
      parameters: [
        'q',
      ],
    },
    'blekko': {
      domains: [
        'blekko.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Jyxo': {
      domains: [
        'jyxo.1188.cz',
      ],
      parameters: [
        'q',
      ],
    },
    'Kataweb': {
      domains: [
        'www.kataweb.it',
      ],
      parameters: [
        'q',
      ],
    },
    'uol.com.br': {
      domains: [
        'busca.uol.com.br',
      ],
      parameters: [
        'q',
      ],
    },
    'Rakuten': {
      domains: [
        'websearch.rakuten.co.jp',
      ],
      parameters: [
        'qt',
      ],
    },
    'Mamma': {
      domains: [
        'www.mamma.com',
        'mamma75.mamma.com',
      ],
      parameters: [
        'query',
      ],
    },
    'Yatedo': {
      domains: [
        'www.yatedo.com',
        'www.yatedo.fr',
      ],
      parameters: [
        'q',
      ],
    },
    'Twingly': {
      domains: [
        'www.twingly.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Delfi latvia': {
      domains: [
        'smart.delfi.lv',
      ],
      parameters: [
        'q',
      ],
    },
    'PriceRunner': {
      domains: [
        'www.pricerunner.co.uk',
      ],
      parameters: [
        'q',
      ],
    },
    'Google': {
      domains: [
        'www.google.com',
        'www.google.ac',
        'www.google.ad',
        'www.google.com.af',
        'www.google.com.ag',
        'www.google.com.ai',
        'www.google.am',
        'www.google.it.ao',
        'www.google.com.ar',
        'www.google.as',
        'www.google.at',
        'www.google.com.au',
        'www.google.az',
        'www.google.ba',
        'www.google.com.bd',
        'www.google.be',
        'www.google.bf',
        'www.google.bg',
        'www.google.com.bh',
        'www.google.bi',
        'www.google.bj',
        'www.google.com.bn',
        'www.google.com.bo',
        'www.google.com.br',
        'www.google.bs',
        'www.google.co.bw',
        'www.google.com.by',
        'www.google.by',
        'www.google.com.bz',
        'www.google.ca',
        'www.google.com.kh',
        'www.google.cc',
        'www.google.cd',
        'www.google.cf',
        'www.google.cat',
        'www.google.cg',
        'www.google.ch',
        'www.google.ci',
        'www.google.co.ck',
        'www.google.cl',
        'www.google.cm',
        'www.google.cn',
        'www.google.com.co',
        'www.google.co.cr',
        'www.google.com.cu',
        'www.google.cv',
        'www.google.com.cy',
        'www.google.cz',
        'www.google.de',
        'www.google.dj',
        'www.google.dk',
        'www.google.dm',
        'www.google.com.do',
        'www.google.dz',
        'www.google.com.ec',
        'www.google.ee',
        'www.google.com.eg',
        'www.google.es',
        'www.google.com.et',
        'www.google.fi',
        'www.google.com.fj',
        'www.google.fm',
        'www.google.fr',
        'www.google.ga',
        'www.google.gd',
        'www.google.ge',
        'www.google.gf',
        'www.google.gg',
        'www.google.com.gh',
        'www.google.com.gi',
        'www.google.gl',
        'www.google.gm',
        'www.google.gp',
        'www.google.gr',
        'www.google.com.gt',
        'www.google.gy',
        'www.google.com.hk',
        'www.google.hn',
        'www.google.hr',
        'www.google.ht',
        'www.google.hu',
        'www.google.co.id',
        'www.google.iq',
        'www.google.ie',
        'www.google.co.il',
        'www.google.im',
        'www.google.co.in',
        'www.google.io',
        'www.google.is',
        'www.google.it',
        'www.google.je',
        'www.google.com.jm',
        'www.google.jo',
        'www.google.co.jp',
        'www.google.co.ke',
        'www.google.ki',
        'www.google.kg',
        'www.google.co.kr',
        'www.google.com.kw',
        'www.google.kz',
        'www.google.la',
        'www.google.com.lb',
        'www.google.com.lc',
        'www.google.li',
        'www.google.lk',
        'www.google.co.ls',
        'www.google.lt',
        'www.google.lu',
        'www.google.lv',
        'www.google.com.ly',
        'www.google.co.ma',
        'www.google.md',
        'www.google.me',
        'www.google.mg',
        'www.google.mk',
        'www.google.ml',
        'www.google.mn',
        'www.google.ms',
        'www.google.com.mt',
        'www.google.mu',
        'www.google.mv',
        'www.google.mw',
        'www.google.com.mx',
        'www.google.com.my',
        'www.google.co.mz',
        'www.google.com.na',
        'www.google.ne',
        'www.google.com.nf',
        'www.google.com.ng',
        'www.google.com.ni',
        'www.google.nl',
        'www.google.no',
        'www.google.com.np',
        'www.google.nr',
        'www.google.nu',
        'www.google.co.nz',
        'www.google.com.om',
        'www.google.com.pa',
        'www.google.com.pe',
        'www.google.com.ph',
        'www.google.com.pk',
        'www.google.pl',
        'www.google.pn',
        'www.google.com.pr',
        'www.google.ps',
        'www.google.pt',
        'www.google.com.py',
        'www.google.com.qa',
        'www.google.ro',
        'www.google.rs',
        'www.google.ru',
        'www.google.rw',
        'www.google.com.sa',
        'www.google.com.sb',
        'www.google.sc',
        'www.google.se',
        'www.google.com.sg',
        'www.google.sh',
        'www.google.si',
        'www.google.sk',
        'www.google.com.sl',
        'www.google.sn',
        'www.google.sm',
        'www.google.so',
        'www.google.st',
        'www.google.com.sv',
        'www.google.td',
        'www.google.tg',
        'www.google.co.th',
        'www.google.com.tj',
        'www.google.tk',
        'www.google.tl',
        'www.google.tm',
        'www.google.to',
        'www.google.com.tn',
        'www.google.tn',
        'www.google.com.tr',
        'www.google.tt',
        'www.google.com.tw',
        'www.google.co.tz',
        'www.google.com.ua',
        'www.google.co.ug',
        'www.google.ae',
        'www.google.co.uk',
        'www.google.us',
        'www.google.com.uy',
        'www.google.co.uz',
        'www.google.com.vc',
        'www.google.co.ve',
        'www.google.vg',
        'www.google.co.vi',
        'www.google.com.vn',
        'www.google.vu',
        'www.google.ws',
        'www.google.co.za',
        'www.google.co.zm',
        'www.google.co.zw',
        'google.com',
        'google.ac',
        'google.ad',
        'google.com.af',
        'google.com.ag',
        'google.com.ai',
        'google.am',
        'google.it.ao',
        'google.com.ar',
        'google.as',
        'google.at',
        'google.com.au',
        'google.az',
        'google.ba',
        'google.com.bd',
        'google.be',
        'google.bf',
        'google.bg',
        'google.com.bh',
        'google.bi',
        'google.bj',
        'google.com.bn',
        'google.com.bo',
        'google.com.br',
        'google.bs',
        'google.co.bw',
        'google.com.by',
        'google.by',
        'google.com.bz',
        'google.ca',
        'google.com.kh',
        'google.cc',
        'google.cd',
        'google.cf',
        'google.cat',
        'google.cg',
        'google.ch',
        'google.ci',
        'google.co.ck',
        'google.cl',
        'google.cm',
        'google.cn',
        'google.com.co',
        'google.co.cr',
        'google.com.cu',
        'google.cv',
        'google.com.cy',
        'google.cz',
        'google.de',
        'google.dj',
        'google.dk',
        'google.dm',
        'google.com.do',
        'google.dz',
        'google.com.ec',
        'google.ee',
        'google.com.eg',
        'google.es',
        'google.com.et',
        'google.fi',
        'google.com.fj',
        'google.fm',
        'google.fr',
        'google.ga',
        'google.gd',
        'google.ge',
        'google.gf',
        'google.gg',
        'google.com.gh',
        'google.com.gi',
        'google.gl',
        'google.gm',
        'google.gp',
        'google.gr',
        'google.com.gt',
        'google.gy',
        'google.com.hk',
        'google.hn',
        'google.hr',
        'google.ht',
        'google.hu',
        'google.co.id',
        'google.iq',
        'google.ie',
        'google.co.il',
        'google.im',
        'google.co.in',
        'google.io',
        'google.is',
        'google.it',
        'google.je',
        'google.com.jm',
        'google.jo',
        'google.co.jp',
        'google.co.ke',
        'google.ki',
        'google.kg',
        'google.co.kr',
        'google.com.kw',
        'google.kz',
        'google.la',
        'google.com.lb',
        'google.com.lc',
        'google.li',
        'google.lk',
        'google.co.ls',
        'google.lt',
        'google.lu',
        'google.lv',
        'google.com.ly',
        'google.co.ma',
        'google.md',
        'google.me',
        'google.mg',
        'google.mk',
        'google.ml',
        'google.mn',
        'google.ms',
        'google.com.mt',
        'google.mu',
        'google.mv',
        'google.mw',
        'google.com.mx',
        'google.com.my',
        'google.co.mz',
        'google.com.na',
        'google.ne',
        'google.com.nf',
        'google.com.ng',
        'google.com.ni',
        'google.nl',
        'google.no',
        'google.com.np',
        'google.nr',
        'google.nu',
        'google.co.nz',
        'google.com.om',
        'google.com.pa',
        'google.com.pe',
        'google.com.ph',
        'google.com.pk',
        'google.pl',
        'google.pn',
        'google.com.pr',
        'google.ps',
        'google.pt',
        'google.com.py',
        'google.com.qa',
        'google.ro',
        'google.rs',
        'google.ru',
        'google.rw',
        'google.com.sa',
        'google.com.sb',
        'google.sc',
        'google.se',
        'google.com.sg',
        'google.sh',
        'google.si',
        'google.sk',
        'google.com.sl',
        'google.sn',
        'google.sm',
        'google.so',
        'google.st',
        'google.com.sv',
        'google.td',
        'google.tg',
        'google.co.th',
        'google.com.tj',
        'google.tk',
        'google.tl',
        'google.tm',
        'google.to',
        'google.com.tn',
        'google.com.tr',
        'google.tt',
        'google.com.tw',
        'google.co.tz',
        'google.com.ua',
        'google.co.ug',
        'google.ae',
        'google.co.uk',
        'google.us',
        'google.com.uy',
        'google.co.uz',
        'google.com.vc',
        'google.co.ve',
        'google.vg',
        'google.co.vi',
        'google.com.vn',
        'google.vu',
        'google.ws',
        'google.co.za',
        'google.co.zm',
        'google.co.zw',
        'google.tn',
        'search.avg.com',
        'isearch.avg.com',
        'www.cnn.com',
        'darkoogle.com',
        'search.darkoogle.com',
        'search.foxtab.com',
        'www.gooofullsearch.com',
        'search.hiyo.com',
        'search.incredimail.com',
        'search1.incredimail.com',
        'search2.incredimail.com',
        'search3.incredimail.com',
        'search4.incredimail.com',
        'search.incredibar.com',
        'search.sweetim.com',
        'www.fastweb.it',
        'search.juno.com',
        'find.tdc.dk',
        'searchresults.verizon.com',
        'search.walla.co.il',
        'search.alot.com',
        'www.googleearth.de',
        'www.googleearth.fr',
        'webcache.googleusercontent.com',
        'encrypted.google.com',
        'googlesyndicatedsearch.com',
        'com.google.android.googlequicksearchbox',
      ],
      parameters: [
        'q',
        'query',
        'Keywords',
      ],
    },
    'Blogpulse': {
      domains: [
        'www.blogpulse.com',
      ],
      parameters: [
        'query',
      ],
    },
    'Hooseek.com': {
      domains: [
        'www.hooseek.com',
      ],
      parameters: [
        'recherche',
      ],
    },
    'Dalesearch': {
      domains: [
        'www.dalesearch.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Alice Adsl': {
      domains: [
        'rechercher.aliceadsl.fr',
      ],
      parameters: [
        'q',
      ],
    },
    'T-Online': {
      domains: [
        'suche.t-online.de',
        'brisbane.t-online.de',
        'navigationshilfe.t-online.de',
      ],
      parameters: [
        'q',
      ],
    },
    'Sogou': {
      domains: [
        'www.sougou.com',
        'www.soso.com',
      ],
      parameters: [
        'query',
        'w',
      ],
    },
    'Hit-Parade': {
      domains: [
        'req.-hit-parade.com',
        'class.hit-parade.com',
        'www.hit-parade.com',
      ],
      parameters: [
        'p7',
      ],
    },
    'SearchCanvas': {
      domains: [
        'www.searchcanvas.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Jungle Key': {
      domains: [
        'junglekey.com',
        'junglekey.fr',
      ],
      parameters: [
        'query',
      ],
    },
    'Interia': {
      domains: [
        'www.google.interia.pl',
      ],
      parameters: [
        'q',
      ],
    },
    'Genieo': {
      domains: [
        'search.genieo.com',
      ],
      parameters: [
        'q',
      ],
    },
    'Tiscali': {
      domains: [
        'search.tiscali.it',
        'search-dyn.tiscali.it',
        'hledani.tiscali.cz',
      ],
      parameters: [
        'q',
        'key',
      ],
    },
    'Gomeo': {
      domains: [
        'www.gomeo.com',
      ],
      parameters: [
        'Keywords',
      ],
    },
  },
  email: {
    'Bigpond': {
      domains: [
        'webmail.bigpond.com',
        'webmail2.bigpond.com',
        'email.telstra.com',
        'basic.messaging.bigpond.com',
      ],
    },
    'Naver Mail': {
      domains: [
        'mail.naver.com',
      ],
    },
    'T-online': {
      domains: [
        'email.t-online.de',
      ],
    },
    'Zoho': {
      domains: [
        'mail.zoho.com',
      ],
    },
    '163 Mail': {
      domains: [
        'mail.163.com',
      ],
    },
    'TIM': {
      domains: [
        'webmail.tim.it',
      ],
    },
    'Yahoo! Mail': {
      domains: [
        'mail.yahoo.net',
        'mail.yahoo.com',
        'mail.yahoo.co.uk',
        'mail.yahoo.co.jp',
        'com.yahoo.mobile.client.android.mail',
      ],
    },
    'iiNet': {
      domains: [
        'webmail.iinet.net.au',
        'mail.iinet.net.au',
      ],
    },
    'E1.ru': {
      domains: [
        'mail.e1.ru',
      ],
    },
    'Vodafone': {
      domains: [
        'webmail.vodafone.co.nz',
        'mail.vodafone.de',
      ],
    },
    '1und1': {
      domains: [
        'deref-1und1-02.de',
      ],
    },
    'Dodo': {
      domains: [
        'webmail.dodo.com.au',
      ],
    },
    '126 Mail': {
      domains: [
        'mail.126.com',
      ],
    },
    'Mailchimp': {
      domains: [
        'com.mailchimp.mailchimp',
      ],
    },
    'Inbox.com': {
      domains: [
        'inbox.com',
      ],
    },
    'iPrimus': {
      domains: [
        'webmail.iprimus.com.au',
      ],
    },
    'Web.de': {
      domains: [
        'deref-web.de',
        '3c.web.de',
        '3c-bap.web.de',
        'lightmailer-bap.web.de',
        'lightmailer-bs.web.de',
      ],
    },
    'QQ Mail': {
      domains: [
        'mail.qq.com',
        'exmail.qq.com',
      ],
    },
    'QIP': {
      domains: [
        'mail.qip.ru',
      ],
    },
    'Sibmail': {
      domains: [
        'sibmail.com',
      ],
    },
    'Freenet': {
      domains: [
        'webmail.freenet.de',
      ],
    },
    'Seznam Mail': {
      domains: [
        'email.seznam.cz',
      ],
    },
    'Westnet': {
      domains: [
        'webmail.westnet.com.au',
      ],
    },
    'Outlook.com': {
      domains: [
        'mail.live.com',
        'outlook.live.com',
        'com.microsoft.office.outlook',
      ],
    },
    'Mail.com': {
      domains: [
        'deref-mail.com',
        '3c-lxa.mail.com',
        'lightmailer.mail.com',
      ],
    },
    'Daum Mail': {
      domains: [
        'mail2.daum.net',
        'mail.daum.net',
      ],
    },
    'UPC': {
      domains: [
        'upcmail.hispeed.ch',
      ],
    },
    '2degrees': {
      domains: [
        'webmail.2degreesbroadband.co.nz',
      ],
    },
    'Beeline': {
      domains: [
        'post.ru',
      ],
    },
    'Infomaniak': {
      domains: [
        'mail.infomaniak.com',
      ],
    },
    'Adam Internet': {
      domains: [
        'webmail.adam.com.au',
      ],
    },
    'Orange Webmail': {
      domains: [
        'orange.fr/webmail',
        'mail01.orange.fr',
        'mail02.orange.fr',
        'wmail.orange.fr',
        'messageriepro3.orange.fr',
        'messagerie.orange.fr',
      ],
    },
    'Ionos': {
      domains: [
        'email.ionos.de',
        'email.ionos.es',
        'email.ionos.fr',
        'email.ionos.it',
        'email.ionos.ca',
        'email.ionos.mx',
        'email.ionos.com',
        'email.ionos.co.uk',
        'mailbusiness.ionos.de',
        'mailbusiness.ionos.es',
        'mailbusiness.ionos.fr',
        'mailbusiness.ionos.it',
        'mailbusiness.ionos.ca',
        'mailbusiness.ionos.mx',
        'mailbusiness.ionos.com',
        'mailbusiness.ionos.co.uk',
      ],
    },
    'earthlink': {
      domains: [
        'com.earthlink.myearthlink',
      ],
    },
    'Bluewin': {
      domains: [
        'rich-v01.bluewin.ch',
        'rich-v02.bluewin.ch',
        'email.bluewin.ch',
      ],
    },
    'AOL Mail': {
      domains: [
        'mail.aol.com',
        'com.aol.mobile.aolapp',
      ],
    },
    'Netspace': {
      domains: [
        'webmail.netspace.net.au',
      ],
    },
    'Optus Zoo': {
      domains: [
        'webmail.optuszoo.com.au',
        'webmail.optusnet.com.au',
      ],
    },
    'Virgin': {
      domains: [
        'webmail.virginbroadband.com.au',
      ],
    },
    'Proton': {
      domains: [
        'mail.proton.me',
      ],
    },
    'Commander': {
      domains: [
        'webmail.commander.net.au',
      ],
    },
    'Mastermail': {
      domains: [
        'mastermail.ru',
        'm.mastermail.ru',
      ],
    },
    'GMX': {
      domains: [
        'deref-gmx.de',
        'deref-gmx.at',
        'deref-gmx.ch',
        'deref-gmx.fr',
        'deref-gmx.es',
        'deref-gmx.it',
        'deref-gmx.com',
        'deref-gmx.net',
        'deref-gmx.co.uk',
        'lightmailer.gmx.de',
        'lightmailer.gmx.at',
        'lightmailer.gmx.ch',
        'lightmailer.gmx.fr',
        'lightmailer.gmx.es',
        'lightmailer.gmx.it',
        'lightmailer.gmx.com',
        'lightmailer.gmx.net',
        'lightmailer.gmx.co.uk',
        'lightmailer-bs.gmx.net',
        'lightmailer-bap.gmx.net',
      ],
    },
    'Yandex': {
      domains: [
        'mail.yandex.ru',
        'mail.yandex.com',
        'mail.yandex.kz',
        'mail.yandex.ua',
        'mail.yandex.by',
      ],
    },
    'Mail.ru': {
      domains: [
        'e.mail.ru',
        'touch.mail.ru',
      ],
    },
    'Ukr.net': {
      domains: [
        'mail.ukr.net',
      ],
    },
    'Rambler': {
      domains: [
        'mail.rambler.ru',
      ],
    },
    'Mynet Mail': {
      domains: [
        'mail.mynet.com',
      ],
    },
    'Gmail': {
      domains: [
        'mail.google.com',
        'com.google.android.gm',
        'inbox.google.com',
      ],
    },
  },
  paid: {
    'AdSpirit': {
      domains: [
        'adspirit.de',
        'rtbcity.com',
        'plusperformance.com',
      ],
    },
    'Flashtalking': {
      domains: [
        'flashtalking.com',
        'servedby.flashtalking.com',
      ],
    },
    'AudienceScience': {
      domains: [
        'wunderloop.net',
      ],
    },
    'Outbrain': {
      domains: [
        'paid.outbrain.com',
      ],
    },
    'Yieldmo': {
      domains: [
        'yieldmo.com',
      ],
    },
    'Mozo': {
      domains: [
        'mozo.com.au',
        'a.mozo.com.au',
      ],
    },
    'Acuity Ads': {
      domains: [
        'acuityplatform.com',
      ],
    },
    'LifeStreet': {
      domains: [
        'lfstmedia.com',
      ],
    },
    'MicroAd': {
      domains: [
        'microad.jp',
      ],
    },
    'Taboola': {
      domains: [
        'trc.taboola.com',
        'api.taboola.com',
        'taboola.com',
      ],
    },
    'Doubleclick': {
      domains: [
        'ad.doubleclick.net',
        'ad-apac.doubleclick.net',
        's0.2mdn.net',
        's1.2mdn.net',
        'dp.g.doubleclick.net',
        'pubads.g.doubleclick.net',
      ],
    },
    'Adform': {
      domains: [
        'adform.net',
      ],
    },
    'Sizmek': {
      domains: [
        'bs.serving-sys.com',
      ],
    },
    'Criteo': {
      domains: [
        'cas.jp.as.criteo.com',
        'cas.criteo.com',
      ],
    },
    'Fluct': {
      domains: [
        'adingo.jp',
      ],
    },
    'LowerMyBills': {
      domains: [
        'lowermybills.com',
      ],
      parameters: [
        'leadid',
      ],
    },
    'White Pages': {
      domains: [
        'www.whitepages.com.au',
        'mobile.whitepages.com.au',
      ],
    },
    'Neustar AdAdvisor': {
      domains: [
        'adadvisor.net',
      ],
    },
    'ONE by AOL': {
      domains: [
        'nexage.com',
      ],
    },
    'Mixpo': {
      domains: [
        'mixpo.com',
      ],
    },
    'Rubicon Project': {
      domains: [
        'optimized-by.rubiconproject.com',
      ],
    },
    'PubMatic': {
      domains: [
        'sshowads.pubmatic.com',
      ],
    },
    'Jivox': {
      domains: [
        'jivox.com',
      ],
    },
    'BidSwitch': {
      domains: [
        'bidswitch.net',
      ],
    },
    'Sonobi': {
      domains: [
        'sonobi.com',
      ],
    },
    'SteelHouse': {
      domains: [
        'steelhousemedia.com',
      ],
    },
    'AdRoll': {
      domains: [
        'adroll.com',
      ],
    },
    'AdNET': {
      domains: [
        'adnet.de',
      ],
    },
    'Tribal Fusion': {
      domains: [
        'cdnx.tribalfusion.com',
      ],
    },
    'Yandex.Market': {
      domains: [
        'market.yandex.ru',
        'm.market.yandex.ru',
      ],
    },
    'StickyADS.tv': {
      domains: [
        'stickyadstv.com',
        'sfx.stickyadstv.com',
      ],
    },
    'ZEDO': {
      domains: [
        'zedo.com',
        'z1.zedo.com',
      ],
    },
    'Plista': {
      domains: [
        'farm.plista.com',
      ],
    },
    'AppNexus': {
      domains: [
        'ib.adnxs.com',
        'adnxs.com',
        '247realmedia.com',
      ],
    },
    'Sovrn': {
      domains: [
        'lijit.com',
      ],
    },
    'Google': {
      domains: [
        'www.googleadservices.com',
        'partner.googleadservices.com',
        'googleads.g.doubleclick.net',
        'tdsf.doubleclick.net',
        'tpc.googlesyndication.com',
        'safeframe.googlesyndication.com',
        'googleadservices.com',
        'imasdk.googleapis.com',
        'www.adsensecustomsearchads.com',
        'syndicatedsearch.goog',
        'pagead2.googlesyndication.com',
      ],
    },
    'Eyeota': {
      domains: [
        'eyeota.net',
      ],
    },
    'Price.ru': {
      domains: [
        'price.ru',
        'v.price.ru',
      ],
    },
    'OpenX': {
      domains: [
        'us-ads.openx.net',
        'openx.net',
        'servedbyopenx.com',
        'openxenterprise.com',
      ],
    },
    'Casale Media': {
      domains: [
        'casalemedia.com',
      ],
    },
    'Adition': {
      domains: [
        'adition.com',
      ],
    },
    'Yandex.Direct': {
      domains: [
        'an.yandex.ru',
        'yabs.yandex.ru',
        'yabs.yandex.ua',
        'yabs.yandex.com',
        'yabs.yandex.by',
      ],
    },
    'ADFOX': {
      domains: [
        'adfox.ru',
        'www.adfox.ru',
        'ads.adfox.ru',
        'www.ads.adfox.ru',
      ],
    },
    'Torg.Mail.ru': {
      domains: [
        'torg.mail.ru',
      ],
    },
    'Sociomantic Labs': {
      domains: [
        'sociomantic.com',
      ],
    },
  },
  social: {
    'hi5': {
      domains: [
        'hi5.com',
      ],
    },
    'Friendster': {
      domains: [
        'friendster.com',
      ],
    },
    'vKruguDruzei.ru': {
      domains: [
        'vkrugudruzei.ru',
      ],
    },
    'Xanga': {
      domains: [
        'xanga.com',
      ],
    },
    'Myspace': {
      domains: [
        'myspace.com',
      ],
    },
    'Buzznet': {
      domains: [
        'buzznet.com',
      ],
    },
    'MyLife': {
      domains: [
        'mylife.ru',
      ],
    },
    'Flickr': {
      domains: [
        'flickr.com',
      ],
    },
    'Whirlpool': {
      domains: [
        'forums.whirlpool.net.au',
      ],
    },
    'Sonico.com': {
      domains: [
        'sonico.com',
      ],
    },
    'Odnoklassniki': {
      domains: [
        'odnoklassniki.ru',
        'ok.ru',
      ],
    },
    'GitHub': {
      domains: [
        'github.com',
      ],
    },
    'Classmates': {
      domains: [
        'classmates.com',
      ],
    },
    'Friends Reunited': {
      domains: [
        'friendsreunited.com',
      ],
    },
    'Hacker News': {
      domains: [
        'news.ycombinator.com',
        'io.github.hidroh.materialistic',
      ],
    },
    'Quora': {
      domains: [
        'quora.com',
      ],
    },
    'LiveJournal': {
      domains: [
        'livejournal.ru',
      ],
    },
    'Netlog': {
      domains: [
        'netlog.com',
      ],
    },
    'Orkut': {
      domains: [
        'orkut.com',
      ],
    },
    'MyHeritage': {
      domains: [
        'myheritage.com',
      ],
    },
    'Multiply': {
      domains: [
        'multiply.com',
      ],
    },
    'Facebook': {
      domains: [
        'facebook.com',
        'fb.me',
        'm.facebook.com',
        'l.facebook.com',
        'lm.facebook.com',
        'com.facebook.katana',
      ],
    },
    'myYearbook': {
      domains: [
        'myyearbook.com',
      ],
    },
    'Renren': {
      domains: [
        'renren.com',
      ],
    },
    'Slack': {
      domains: [
        'app.slack.com',
        'com.slack',
      ],
    },
    'WeeWorld': {
      domains: [
        'weeworld.com',
      ],
    },
    'Vimeo': {
      domains: [
        'vimeo.com',
      ],
    },
    'Eksi Sozluk': {
      domains: [
        'Sozluk.com',
        'sourtimes.org',
      ],
    },
    'Mixi': {
      domains: [
        'mixi.jp',
      ],
    },
    'Geni': {
      domains: [
        'geni.com',
      ],
    },
    'Uludag Sozluk': {
      domains: [
        'uludagsozluk.com',
        'ulusozluk.com',
      ],
    },
    'SourceForge': {
      domains: [
        'sourceforge.net',
      ],
    },
    'Plaxo': {
      domains: [
        'plaxo.com',
      ],
    },
    'Taringa!': {
      domains: [
        'taringa.net',
      ],
    },
    'Tagged': {
      domains: [
        'login.tagged.com',
      ],
    },
    'XING': {
      domains: [
        'xing.com',
      ],
    },
    'Instagram': {
      domains: [
        'instagram.com',
        'l.instagram.com',
        'com.instagram.android',
      ],
    },
    'Vkontakte': {
      domains: [
        'm.vk.com',
        'vk.com',
        'away.vk.com',
        'vkontakte.ru',
      ],
    },
    'Weibo': {
      domains: [
        'weibo.com',
        't.cn',
      ],
    },
    'Telegram': {
      domains: [
        'web.telegram.org',
        'org.telegram.messenger',
        'org.telegram.messenger.web',
        'org.aka.messenger',
        'org.telegram.biftogram',
        'org.telegram.plus',
      ],
    },
    'Twitter': {
      domains: [
        'twitter.com',
        't.co',
        'com.twitter.android',
      ],
    },
    'Snapchat': {
      domains: [
        'com.snapchat.android',
        'snapchat.com',
      ],
    },
    'Donanimhaber': {
      domains: [
        'donanimhaber.com',
      ],
    },
    'WAYN': {
      domains: [
        'wayn.com',
      ],
    },
    'Skype': {
      domains: [
        'web.skype.com',
      ],
    },
    'Mail.ru': {
      domains: [
        'my.mail.ru',
      ],
    },
    'Badoo': {
      domains: [
        'badoo.com',
      ],
    },
    'Instela': {
      domains: [
        'instela.com',
      ],
    },
    'Habbo': {
      domains: [
        'habbo.com',
      ],
    },
    'Pinterest': {
      domains: [
        'pinterest.ca',
        'pinterest.cl',
        'pinterest.co.kr',
        'pinterest.com',
        'pinterest.com.au',
        'pinterest.co.uk',
        'pinterest.de',
        'pinterest.dk',
        'pinterest.es',
        'pinterest.fr',
        'pinterest.jp',
        'pinterest.nz',
        'pinterest.pt',
        'pinterest.se',
        'pinterest.at',
        'pinterest.ch',
        'pinterest.com.mx',
        'pinterest.ie',
        'pinterest.it',
        'pinterest.ph',
        'pinterest.ru',
        'com.pinterest',
      ],
    },
    'LinkedIn': {
      domains: [
        'com.linkedin.android',
        'linkedin.com',
        'lnkd.in',
      ],
    },
    'Foursquare': {
      domains: [
        'foursquare.com',
      ],
    },
    'Douban': {
      domains: [
        'douban.com',
      ],
    },
    'Windows Live Spaces': {
      domains: [
        'login.live.com',
      ],
    },
    'BlackPlanet': {
      domains: [
        'blackplanet.com',
      ],
    },
    'Lnk.Bio': {
      domains: [
        'lnk.bio',
      ],
    },
    'Cyworld': {
      domains: [
        'global.cyworld.com',
      ],
    },
    'Pocket': {
      domains: [
        'getpocket.com',
      ],
    },
    'Skyrock': {
      domains: [
        'skyrock.com',
      ],
    },
    'Threads': {
      domains: [
        'threads.net',
        'l.threads.net',
        'com.instagram.barcelona',
      ],
    },
    'WhatsApp': {
      domains: [
        'web.whatsapp.com',
        'com.whatsapp',
      ],
    },
    'Disqus': {
      domains: [
        'redirect.disqus.com',
        'disq.us',
        'disqus.com',
      ],
    },
    'StudiVZ': {
      domains: [
        'studivz.net',
      ],
    },
    'Fotolog': {
      domains: [
        'fotolog.com',
      ],
    },
    'ITU Sozluk': {
      domains: [
        'itusozluk.com',
      ],
    },
    'Google+': {
      domains: [
        'url.google.com',
        'plus.google.com',
      ],
    },
    'Nasza-klasa.pl': {
      domains: [
        'nk.pl',
      ],
    },
    'Qzone': {
      domains: [
        'qzone.qq.com',
      ],
    },
    'Flixster': {
      domains: [
        'flixster.com',
      ],
    },
    'Bebo': {
      domains: [
        'bebo.com',
      ],
    },
    'Tuenti': {
      domains: [
        'tuenti.com',
      ],
    },
    'Youtube': {
      domains: [
        'youtube.com',
        'youtu.be',
      ],
    },
    'Reddit': {
      domains: [
        'reddit.com',
        'io.syncapps.lemmy_sync',
        'com.laurencedawson.reddit_sync',
        'com.laurencedawson.reddit_sync.pro',
      ],
    },
    'Viadeo': {
      domains: [
        'viadeo.com',
      ],
    },
    'Tildes': {
      domains: [
        'tildes.net',
        'com.talklittle.android.tildes',
      ],
    },
    'Workplace': {
      domains: [
        'l.workplace.com',
        'lm.workplace.com',
      ],
    },
    'StackOverflow': {
      domains: [
        'stackoverflow.com',
      ],
    },
    'Gaia Online': {
      domains: [
        'gaiaonline.com',
      ],
    },
    'StumbleUpon': {
      domains: [
        'stumbleupon.com',
      ],
    },
    'Inci Sozluk': {
      domains: [
        'inci.sozlukspot.com',
        'incisozluk.com',
        'incisozluk.cc',
      ],
    },
    'Identi.ca': {
      domains: [
        'identi.ca',
      ],
    },
    'Last.fm': {
      domains: [
        'lastfm.ru',
      ],
    },
    'Tumblr': {
      domains: [
        'tumblr.com',
        't.umblr.com',
      ],
    },
    'TikTok': {
      domains: [
        'tiktok.com',
      ],
    },
    'Hocam.com': {
      domains: [
        'hocam.com',
      ],
    },
    'Delicious': {
      domains: [
        'delicious.com',
      ],
    },
    'Hyves': {
      domains: [
        'hyves.nl',
      ],
    },
    'Paper.li': {
      domains: [
        'paper.li',
      ],
    },
    'MoiKrug.ru': {
      domains: [
        'moikrug.ru',
      ],
    },
  },
}
