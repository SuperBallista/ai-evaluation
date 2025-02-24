<!-- KakaoLogin.svelte -->
<script>
    const currentUrl = window.location.href;
    const KAKAO_CLIENT_ID = "680697e03032655b89fbd17dbae18e46"; // 여기에 발급받은 REST API 키 입력
    const REDIRECT_URI = currentUrl + "kakao"; // 리다이렉트 URI 설정
  
    function loginWithKakao() {
      const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
      window.location.href = KAKAO_AUTH_URL;
    }
  </script>
  
  <button
    on:click={loginWithKakao}
    class="cursor-pointer bg-[#FEE500] text-black font-bold py-2 px-4 rounded flex items-center justify-center shadow-md hover:bg-[#FDD835] transition"
  >
    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" alt="카카오톡 로고" class="w-6 h-6 mr-2" />
    카카오 로그인
  </button>
  