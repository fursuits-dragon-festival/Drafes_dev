/**
 * ============================================================
 * 定数定義 - const.js
 * ============================================================
 * APIエンドポイント・設定値をここで一元管理する
 * URL変更時はこのファイルのみ修正すること
 */
const CONST = {

  // GAS ウェブアプリのデプロイ URL
  // ※ GAS を再デプロイした場合はこの値を更新すること
  GAS_BASE: 'https://script.google.com/macros/s/AKfycbzgLEHYn-rHu4xJAiUfBxVpvWJ-wNf37j-7uYxXgQ5z0N--iMznKNzbP-838l78GboK/exec',

  // API エンドポイント（GAS_BASE に連結して使用）
  API: {
    STATUS:         '?path=/api/status',
    PARTICIPANTS:   '?path=/api/participants',
    VALIDATE_TOKEN: '?path=/api/validate-token'
  },

  // アップロード制限
  UPLOAD: {
    MAX_BYTES:     20 * 1024 * 1024,            // 20 MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png']
  },

  // 参加者一覧ナビゲーションリンクを表示する日時
  PARTICIPANTS_OPEN_TIME: new Date('2026-04-01T12:00:00+09:00')

};
