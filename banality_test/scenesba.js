/* ---------- experiment ba: <주제> ---------- */
// One image all the way: <한 가지 비유>.
// 장면 함수 이름 = script.py의 scene + 'Scene'. CAMS에 카메라 [z0, z1, cx, cy]를 등록한다.
// 쓸 수 있는 도구: char/Z/doctor/pop/label/outlined/big/T8/card14/quote14/labBg/desk12/chair12/nightRoom12/streetNight12/flip/shadow/walkPose 등.
// 016의 망토·요일 HUD·회의실 같은 부품이 필요하면 ../mencius016/scenes016*.js에서 함수를 복사해 이름 끝을 ba로 바꿔 쓴다.
Object.assign(CAMS, {});
// 템플릿에는 예전 편(014)의 render 덮어쓰기(상단 HUD)가 남아 있다 → 기본 render로 되돌린다. 이 편의 HUD가 필요하면 여기서 감싼다.
render = function (t) { _render12(t); };
window.render = render;
