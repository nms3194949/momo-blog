// ============================================================
//  網站設定：上線前只需要改這個檔案
// ============================================================

export const SITE = {
  /** 網站名稱 */
  name: 'MOMO雙贏策略',
  /** 一句話介紹（首頁、搜尋結果、llms.txt 會用到） */
  description:
    'MOMO 的資產配置筆記：配息現金流、保單基金規劃、市場判讀。用白話把基金與配置講清楚。',
  /** 語系 */
  lang: 'zh-Hant-TW',
  locale: 'zh_TW',
};

export const AUTHOR = {
  name: 'MOMO（余明哲）',
  alternateName: ['MOMO', '余明哲', '明哲MOMO'],
  /** 名字下方的介紹文字 */
  jobTitle: '保單基金規劃・資產配置教育',
  /**
   * 服務單位（選填）。留空就不會顯示。
   * 確認公司法遵規定後，可以改成例如 '高成保險經紀人'
   */
  worksFor: '',
  /** 作者介紹（關於頁、文章底部、結構化資料都會用到） */
  bio: '專注投資型保單內的基金配置，長期追蹤各類型基金的配息與淨值表現。主張「真實報酬 = 配息 + 淨值變化」，用核心衛星配置與動態再平衡，協助客戶規劃長期的配息現金流。',
  /**
   * 專業資格（選填）。留空就不會顯示「專業資格」區塊。
   * 例如：['人身保險業務員', '投資型保險商品業務員']
   */
  credentials: [
    '人身保險業務員',
    '投資型保險商品業務員',
    '財產保險業務員',
    '外幣收付之非投資型保險商品業務員',
    '信託業業務人員',
    '投信投顧相關法規',
  ] as string[],
  /** 作者大頭照，放在 public/ 底下 */
  avatar: '/avatar.png',
};

export const LINKS = {
  /** 官方 LINE 加好友網址 */
  line: 'https://lin.ee/sdrEuGA',
  /** LINE 上的關鍵字（文末 CTA 會顯示「LINE 輸入『配置』」） */
  lineKeyword: '配置',
  /** IG 帳號網址 */
  instagram: 'https://www.instagram.com/momo_82786/',
  threads: 'https://www.threads.net/@momo_82786',
};

/**
 * 所有導流連結都會自動加上 UTM，
 * 這樣在 LINE 後台或 GA4 就能分辨名單是從網站來的。
 */
export function withUtm(url: string, campaign: string, content = 'cta') {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'website');
    u.searchParams.set('utm_medium', 'referral');
    u.searchParams.set('utm_campaign', campaign);
    u.searchParams.set('utm_content', content);
    return u.toString();
  } catch {
    return url;
  }
}

/** 金融商品宣傳免責聲明，每一頁頁尾都會自動顯示 */
export const DISCLAIMER =
  '本網站內容僅供教育與資訊分享，不構成任何投資建議或商品推介。基金與投資型保單之投資風險由要保人自行承擔，過去績效不代表未來表現，配息率不代表報酬率，且配息可能由本金支出。投資前請詳閱商品說明書及公開說明書，並依自身財務狀況與風險承受度審慎評估。';

/** 名字下方的完整介紹，例如「保單基金規劃・資產配置教育」或「保單基金規劃・資產配置教育・高成保險經紀人」 */
export const AUTHOR_TAGLINE = [AUTHOR.jobTitle, AUTHOR.worksFor].filter(Boolean).join('・');
