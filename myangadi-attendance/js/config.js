/* js/config.js — App constants and Supabase credentials */
'use strict';

window.APP_CONFIG = Object.freeze({
  SUPABASE_URL : 'https://dvwvsqbzagbxowfnnlbu.supabase.co',
  SUPABASE_KEY : 'sb_publishable_zHykposZ3roSM9QR_pNiew_o0Anf9i_',

  /* Admin login: username + AUTH_DOMAIN → Supabase email */
  ADMIN_USERS  : ['myangadi', 'punitha'],
  AUTH_DOMAIN  : '@attendance.local',

  /* Face recognition */
  FACE_THRESHOLD : 0.6,
  MODEL_URL      : 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights',
  PHOTO_COUNT    : 3,       // photos required for registration

  /* Toast */
  TOAST_DURATION : 12000,  // ms

  /* Salary */
  SALARY_DAYS      : 30,   // divisor for monthly → daily
  ABSENCE_MULTIPLIER: 2,   // unannounced absence penalty
});
