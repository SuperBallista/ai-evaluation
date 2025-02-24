<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import BoxOverlay from "./lib/custom/BoxOverlay.svelte";
  import Teacher from "./pages/Teacher.svelte";
  import Student from "./pages/Student.svelte";
  import Kakao from "./pages/Kakao.svelte";
  import NotFound from "./pages/NotFound.svelte";

</script>

<BoxOverlay/>

<Router>
  <Route path="/student" component={Student} />
  <Route path="/kakao" component={Kakao} />
  <Route path="/" component={Teacher} />
  <Route path="*" component={NotFound}/>
</Router>
