<script lang="ts">
    import QRCode from "qrcode";
    import { qrCode } from "../../lib/store/pageStore";
  
    let qrImage: string | null = null;
    let copied = false; // 복사 완료 메시지 표시 여부
  
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
    {#if $qrCode}
            <img src={qrImage} alt="QR Code">
            <br/>
            {$qrCode}
      {/if}
