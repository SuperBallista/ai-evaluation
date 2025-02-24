<script lang="ts">
  import QRCode from "qrcode";
  import { qrCode } from "../../lib/store/pageStore";

  let qrImage: string | null = null;

  if ($qrCode) {
      QRCode.toDataURL($qrCode, { width: 350 }, (err: Error | null, url: string) => {
          if (!err) {
              qrImage = url;
          } else {
              console.error("QR 코드 생성 오류:", err);
          }
      });
  }
</script>

<!-- ✅ 전체 화면 중앙 정렬 -->
<div class="flex justify-center items-center h-screen w-screen bg-main-bg3">
  {#if $qrCode}
      <div class="bg-white p-6 rounded-lg shadow-lg">
          <img src={qrImage} alt="QR Code" class="w-80 h-80" />
      </div>
  {/if}
</div>
