<script>
    import { onMount } from "svelte";
    import { teacherInfo } from "@lib/store/userStore"; // ✅ Store 가져오기
    import { showMessageBox } from "@lib/custom/customStore";
    import { navigate } from "svelte-routing";
    import NotFound from "./NotFound.svelte";
  
    onMount(async () => {

      showMessageBox("loading", "로그인 중", "로그인이 진행되고 있습니다")
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code"); // ✅ URL에서 인가 코드 추출
  
        if (!code) {
            showMessageBox("error","잘못된 접근","잘못된 접근입니다")
         return;
        }
  
        // ✅ 백엔드에 로그인 요청
        const response = await fetch(`/api/login/kakao?code=${code}`, {
          method: "GET",
          credentials: "include", // ✅ 세션 기반 로그인 시 필요
        });
  
        const data = await response.json();
  
        if (data.userId) {
          // ✅ store에 로그인 정보 저장
          teacherInfo.set(Number(data.userId));
          showMessageBox("success","로그인 성공","로그인하였습니다")
        }
        else{
            showMessageBox("error","로그인 실패","로그인에 실패하였습니다")
        }
      } catch (error) {
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
      } finally {
                  // ✅ 대시보드로 이동
                  navigate("/"); // ✅ 현재 페이지를 새로고침 없이 부드럽게 이동
            }




    }
  );
  </script>
<NotFound/>
