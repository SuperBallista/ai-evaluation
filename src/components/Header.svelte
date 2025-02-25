<header class="bg-main text-default border-b border-main-bg3 p-4 flex justify-between items-center">
    <div on:click={() => {viewMain.set(null)}} class="cursor-pointer text-xl font-bold">학생 평가 간소화 서비스</div>
    <nav class="flex space-x-4">
      <button on:click={() => {viewMain.set("subject")}} class="cursor-pointer btn-default px-4 py-2 rounded-xl">교과관리</button>
      <button on:click={() => {viewMain.set("upload"); editQuestion.set(null)}} class="cursor-pointer btn-default px-4 py-2 rounded-xl">평가지 업로드</button>
      <button on:click={() => {viewMain.set("evaluation")}} class="cursor-pointer btn-default px-4 py-2 rounded-xl">학생평가</button>
      <button on:click={() => {logout()}} class="cursor-pointer btn-default px-4 py-2 rounded-xl">로그아웃</button>
    </nav>
  </header>
  <script lang="ts">
    import { teacherInfo } from "@lib/store/userStore";
    import { showMessageBox } from "@lib/custom/customStore";
    import { editQuestion, viewMain } from "@lib/store/pageStore";

    async function logout() {
      const userResponse = await showMessageBox("confirm","로그아웃 확인", "지금 로그아웃을 하면 학생들은 작성중인 답안을 제출할 수 없습니다. 로그아웃 하시겠습니까?")      
      if (!userResponse.success){ return }
      try{
        const response = await fetch("/api/login",{
          method:"DELETE",
          credentials: "include"
        })
        if (response.ok){
          showMessageBox("success", "로그아웃 성공", "로그아웃하였습니다")
          teacherInfo.set(null)
        }
        else {
            const data:{message:string} = await response.json()
            showMessageBox("error","에러 발생", data.message);
        }
    } catch (error){
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
    }      
    }

  </script>