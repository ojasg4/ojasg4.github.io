/* =============================================================
   "From sequence to ensemble" — click-through figure for the
   AI and protein biology post.

   The captions live in the post's HTML (<ol class="story__steps">),
   one <li data-scene="..."> per click. Everything is drawn on one
   canvas. Real data: ubiquitin's sequence and C-alpha positions
   (PDB 1UBQ), the distance map computed from them, and the ten
   NMR models of PDB 1D3Z (aligned to 1UBQ on residues 1-70).
   Schematic: the sequence alignment, the co-folding grid and the
   free-energy curve.

   Advance: click the figure, press Space or the right arrow, or use
   Next. Back restarts the previous step from its beginning.
   ============================================================= */
(function () {
  'use strict';

  var el = document.getElementById('modelStory');
  if (!el) return;

  var DATA = {"seq":"MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQRLIFAGKQLEDGRTLSDYNIQKESTLHLVLRLRGG","ss":"SSSSSSSLLSSSSSSSSLLLLLHHHHHHHHHHHHLLLLLSSSSSSLLSSLLLLLLLLLLLLLLLLSSSSSSSLLLL","ca":[[-10.6,-3.6,8.1],[-11.1,-2.0,4.6],[-8.5,0.4,3.3],[-8.3,2.2,-0.0],[-5.1,2.4,-2.2],[-5.3,5.2,-4.8],[-3.0,4.9,-7.8],[-1.8,7.6,-10.2],[-4.2,6.6,-12.9],[-7.3,7.3,-10.9],[-8.0,3.7,-10.1],[-8.6,3.0,-6.4],[-8.3,-0.5,-5.1],[-9.9,-1.7,-1.9],[-8.0,-4.2,0.3],[-9.0,-6.1,3.4],[-6.2,-5.9,6.0],[-5.5,-6.0,9.7],[-3.4,-3.3,11.5],[-1.0,-6.1,12.5],[-0.1,-6.7,8.8],[3.3,-5.6,7.7],[3.8,-3.3,4.8],[5.5,-6.2,2.9],[2.2,-8.1,3.3],[0.1,-5.2,2.0],[2.4,-5.0,-1.1],[1.9,-8.8,-1.7],[-1.9,-8.3,-1.5],[-1.7,-5.5,-4.1],[0.5,-7.8,-6.4],[-2.0,-10.6,-6.0],[-5.0,-8.4,-7.0],[-3.6,-5.9,-9.6],[-0.3,-7.6,-10.6],[2.1,-4.9,-9.7],[5.5,-6.3,-8.5],[6.2,-5.2,-4.9],[9.6,-3.8,-5.9],[7.8,-1.2,-8.0],[5.5,-0.1,-5.2],[6.0,3.0,-3.1],[3.2,3.4,-0.5],[2.5,6.9,1.0],[0.4,7.8,4.0],[0.2,11.1,5.8],[3.3,12.2,3.8],[5.5,9.3,5.0],[6.8,6.5,2.7],[5.8,3.2,4.4],[8.7,0.8,5.1],[8.3,-3.0,4.5],[9.0,-4.3,8.0],[6.7,-2.0,9.9],[3.0,-2.8,10.4],[-0.0,-0.6,9.6],[-0.5,-0.0,13.3],[3.0,1.5,13.5],[1.7,4.3,11.3],[-1.7,4.6,13.0],[-3.6,3.7,9.8],[-7.3,3.2,10.9],[-10.2,1.7,9.0],[-11.1,3.4,5.7],[-7.8,5.2,5.4],[-6.5,5.9,1.9],[-2.8,5.1,1.0],[-1.3,6.5,-2.2],[0.6,4.1,-4.5],[3.4,5.6,-6.6],[5.2,3.2,-9.0],[9.0,3.3,-9.3],[9.9,1.4,-12.5],[13.4,-0.0,-13.0],[14.6,1.4,-16.3],[14.0,4.6,-18.4]],"ens":[[[-10.5,-3.5,8.6],[-10.9,-2.1,5.0],[-8.4,0.3,3.5],[-8.2,2.1,0.2],[-5.2,2.5,-2.2],[-5.3,5.1,-5.0],[-3.2,4.8,-8.2],[-1.5,7.4,-10.3],[-4.2,6.8,-13.0],[-7.0,7.7,-10.6],[-8.1,4.1,-9.8],[-9.1,3.2,-6.2],[-8.5,-0.3,-4.8],[-10.2,-1.7,-1.6],[-8.2,-4.2,0.6],[-9.1,-6.2,3.7],[-6.3,-5.9,6.3],[-5.5,-6.2,10.0],[-3.5,-3.6,12.1],[-0.9,-6.3,12.6],[-0.4,-6.8,8.8],[3.0,-5.8,7.5],[3.5,-3.3,4.7],[5.2,-6.1,2.7],[2.1,-8.2,3.2],[-0.0,-5.3,1.9],[2.2,-4.9,-1.1],[1.8,-8.7,-1.7],[-2.0,-8.2,-1.7],[-1.7,-5.5,-4.3],[0.5,-7.7,-6.4],[-2.1,-10.4,-6.3],[-4.8,-7.9,-7.4],[-2.9,-5.7,-9.9],[0.2,-7.8,-11.0],[2.6,-5.0,-9.9],[5.8,-6.6,-8.4],[6.4,-5.3,-4.7],[9.9,-4.0,-5.7],[8.3,-1.5,-8.1],[5.7,-0.2,-5.6],[6.0,2.7,-3.2],[3.3,3.3,-0.5],[2.7,6.7,1.0],[0.4,7.7,3.8],[-0.1,11.2,5.2],[3.0,12.3,3.3],[5.3,9.5,4.7],[6.8,6.6,2.8],[5.9,3.3,4.5],[8.7,0.7,5.1],[8.3,-3.0,4.3],[9.5,-4.0,7.9],[6.8,-2.0,9.7],[3.0,-2.6,10.3],[-0.1,-0.6,9.7],[-0.7,0.0,13.4],[2.8,1.6,13.6],[1.5,4.3,11.3],[-1.8,4.7,13.1],[-3.6,3.7,9.9],[-7.3,3.3,10.9],[-10.4,1.9,9.1],[-11.3,3.6,5.8],[-7.8,5.1,5.6],[-6.6,6.0,2.1],[-3.0,5.1,1.0],[-1.3,6.4,-2.2],[0.6,4.0,-4.5],[3.6,5.2,-6.5],[5.3,3.3,-9.3],[9.1,3.3,-10.0],[10.6,2.5,-13.3],[14.3,1.7,-13.8],[14.1,2.5,-17.5],[12.6,5.6,-19.2]],[[-10.4,-3.4,8.6],[-10.8,-2.1,5.1],[-8.4,0.4,3.5],[-8.2,2.2,0.1],[-5.2,2.5,-2.2],[-5.3,5.2,-5.0],[-3.2,4.9,-8.2],[-1.5,7.6,-10.3],[-4.1,6.8,-13.0],[-7.0,7.7,-10.7],[-8.0,4.1,-9.8],[-9.0,3.2,-6.2],[-8.5,-0.3,-4.8],[-10.2,-1.7,-1.7],[-8.2,-4.1,0.5],[-9.0,-6.1,3.7],[-6.2,-5.8,6.2],[-5.5,-6.2,9.9],[-3.5,-3.6,12.0],[-0.9,-6.3,12.5],[-0.4,-6.8,8.8],[3.0,-5.7,7.5],[3.5,-3.3,4.6],[5.3,-6.1,2.7],[2.2,-8.2,3.2],[-0.0,-5.3,1.9],[2.2,-5.0,-1.2],[1.8,-8.8,-1.8],[-2.0,-8.3,-1.7],[-1.7,-5.6,-4.3],[0.5,-7.8,-6.5],[-2.1,-10.5,-6.4],[-4.8,-8.0,-7.5],[-2.9,-5.8,-10.0],[0.2,-7.8,-11.0],[2.6,-5.0,-9.9],[5.8,-6.6,-8.4],[6.4,-5.3,-4.7],[9.9,-4.0,-5.6],[8.3,-1.5,-8.1],[5.7,-0.2,-5.5],[6.0,2.7,-3.1],[3.3,3.3,-0.5],[2.7,6.7,1.1],[0.4,7.7,3.9],[-0.1,11.3,5.2],[3.0,12.4,3.3],[5.2,9.6,4.7],[6.7,6.6,2.9],[5.8,3.3,4.6],[8.6,0.8,5.2],[8.3,-2.9,4.3],[9.4,-4.1,7.8],[6.8,-2.0,9.7],[3.0,-2.6,10.3],[-0.1,-0.6,9.6],[-0.7,0.0,13.3],[2.8,1.6,13.6],[1.6,4.4,11.2],[-1.7,4.8,13.2],[-3.7,3.8,10.0],[-7.4,3.5,10.9],[-10.4,1.9,9.2],[-11.3,3.5,5.9],[-7.8,5.1,5.6],[-6.6,5.9,2.1],[-3.1,5.0,1.0],[-1.3,6.3,-2.1],[0.6,3.9,-4.5],[3.5,5.1,-6.6],[5.2,3.1,-9.4],[8.9,3.0,-9.8],[10.2,2.0,-13.3],[13.7,0.7,-13.7],[13.6,1.2,-17.4],[12.5,4.2,-19.5]],[[-10.4,-3.5,8.6],[-10.8,-2.2,5.0],[-8.4,0.3,3.5],[-8.2,2.2,0.1],[-5.2,2.6,-2.2],[-5.3,5.2,-5.0],[-3.2,4.9,-8.2],[-1.5,7.4,-10.3],[-4.2,6.9,-12.9],[-7.0,7.7,-10.5],[-8.0,4.1,-9.7],[-9.0,3.1,-6.1],[-8.5,-0.4,-4.8],[-10.2,-1.8,-1.6],[-8.2,-4.2,0.6],[-9.0,-6.2,3.7],[-6.2,-5.9,6.3],[-5.5,-6.3,10.0],[-3.5,-3.7,12.0],[-0.8,-6.3,12.6],[-0.3,-6.8,8.8],[3.0,-5.8,7.5],[3.5,-3.3,4.7],[5.2,-6.2,2.7],[2.0,-8.2,3.2],[-0.1,-5.3,1.9],[2.2,-5.0,-1.1],[1.8,-8.7,-1.7],[-2.0,-8.4,-1.6],[-1.7,-5.6,-4.3],[0.5,-7.9,-6.4],[-2.1,-10.6,-6.2],[-4.8,-8.2,-7.4],[-3.0,-5.9,-9.9],[0.1,-7.9,-10.9],[2.5,-5.1,-9.9],[5.7,-6.5,-8.4],[6.5,-5.2,-4.7],[9.9,-3.8,-5.7],[8.3,-1.4,-8.1],[5.7,-0.1,-5.6],[6.0,2.9,-3.2],[3.3,3.4,-0.6],[2.7,6.8,1.0],[0.5,7.8,3.9],[0.1,11.2,5.4],[3.2,12.3,3.4],[5.4,9.5,4.8],[6.8,6.6,2.8],[5.9,3.3,4.5],[8.6,0.6,5.1],[8.3,-3.1,4.3],[9.5,-4.1,7.8],[6.8,-2.1,9.7],[3.0,-2.7,10.3],[-0.1,-0.6,9.6],[-0.7,0.0,13.3],[2.8,1.7,13.5],[1.5,4.4,11.2],[-1.8,4.7,13.0],[-3.7,3.8,9.9],[-7.4,3.4,10.8],[-10.4,1.9,9.1],[-11.3,3.6,5.8],[-7.9,5.2,5.5],[-6.7,6.0,2.0],[-3.1,5.2,1.0],[-1.3,6.5,-2.1],[0.6,4.2,-4.5],[3.6,5.4,-6.6],[5.1,3.5,-9.4],[8.8,3.1,-10.3],[10.3,2.3,-13.8],[13.7,1.0,-14.4],[13.6,1.9,-18.0],[15.8,0.3,-20.7]],[[-10.4,-3.6,8.6],[-10.8,-2.3,5.1],[-8.4,0.3,3.6],[-8.2,2.1,0.2],[-5.2,2.5,-2.2],[-5.2,5.2,-4.9],[-3.1,4.9,-8.1],[-1.4,7.5,-10.2],[-4.0,6.8,-12.8],[-6.9,7.7,-10.4],[-7.9,4.2,-9.7],[-9.0,3.2,-6.1],[-8.5,-0.3,-4.8],[-10.2,-1.7,-1.7],[-8.2,-4.2,0.5],[-9.1,-6.2,3.6],[-6.3,-5.9,6.1],[-5.6,-6.3,9.8],[-3.6,-3.6,11.9],[-1.0,-6.2,12.4],[-0.4,-6.7,8.7],[3.0,-5.6,7.4],[3.5,-3.1,4.6],[5.2,-5.9,2.5],[2.1,-8.0,3.1],[-0.2,-5.2,1.9],[2.0,-4.9,-1.2],[1.7,-8.7,-1.7],[-2.1,-8.4,-1.7],[-1.8,-5.6,-4.3],[0.4,-7.8,-6.4],[-2.2,-10.5,-6.3],[-4.9,-8.1,-7.4],[-3.0,-5.9,-9.9],[0.1,-7.9,-10.9],[2.5,-5.0,-9.9],[5.7,-6.5,-8.4],[6.4,-5.2,-4.7],[9.9,-3.9,-5.6],[8.4,-1.5,-8.1],[5.8,-0.2,-5.6],[6.1,2.7,-3.1],[3.4,3.2,-0.5],[2.8,6.6,1.0],[0.5,7.8,3.8],[0.1,11.3,5.2],[3.1,12.5,3.2],[5.4,9.7,4.7],[6.9,6.7,2.8],[5.9,3.4,4.5],[8.7,0.8,5.1],[8.4,-2.9,4.3],[9.6,-3.9,7.9],[6.8,-1.9,9.7],[3.1,-2.6,10.3],[-0.1,-0.6,9.7],[-0.7,0.0,13.4],[2.8,1.6,13.6],[1.5,4.4,11.3],[-1.8,4.7,13.2],[-3.7,3.8,10.1],[-7.4,3.3,10.9],[-10.4,1.8,9.2],[-11.3,3.5,5.9],[-7.9,5.1,5.6],[-6.6,5.9,2.1],[-3.1,4.9,1.0],[-1.3,6.2,-2.0],[0.6,3.9,-4.5],[3.5,5.1,-6.6],[5.0,3.2,-9.5],[8.8,2.9,-9.9],[10.4,2.2,-13.3],[14.0,1.3,-14.2],[15.7,1.6,-17.6],[18.6,-0.4,-19.0]],[[-10.3,-3.4,8.7],[-10.7,-2.2,5.1],[-8.4,0.4,3.5],[-8.2,2.1,0.1],[-5.2,2.5,-2.2],[-5.3,5.1,-5.0],[-3.2,4.8,-8.2],[-1.5,7.3,-10.5],[-4.2,6.6,-13.1],[-7.0,7.6,-10.7],[-8.0,4.1,-9.8],[-9.1,3.2,-6.2],[-8.5,-0.3,-4.8],[-10.2,-1.6,-1.7],[-8.2,-4.0,0.5],[-9.0,-6.1,3.6],[-6.2,-5.9,6.2],[-5.5,-6.3,9.9],[-3.6,-3.7,11.9],[-0.9,-6.3,12.5],[-0.4,-6.8,8.8],[3.0,-5.8,7.5],[3.5,-3.3,4.7],[5.2,-6.1,2.7],[2.1,-8.1,3.2],[-0.1,-5.3,1.9],[2.2,-5.0,-1.1],[1.7,-8.7,-1.7],[-2.1,-8.3,-1.7],[-1.7,-5.5,-4.3],[0.5,-7.8,-6.4],[-2.1,-10.4,-6.4],[-4.8,-8.0,-7.5],[-2.9,-5.7,-9.9],[0.2,-7.8,-11.0],[2.6,-5.0,-9.9],[5.8,-6.5,-8.4],[6.4,-5.2,-4.7],[9.9,-3.9,-5.6],[8.2,-1.5,-8.0],[5.7,-0.2,-5.5],[6.0,2.8,-3.1],[3.3,3.3,-0.5],[2.7,6.8,1.0],[0.5,7.7,3.9],[-0.1,11.3,5.2],[3.1,12.3,3.3],[5.3,9.6,4.7],[6.8,6.6,2.8],[5.9,3.3,4.6],[8.6,0.7,5.1],[8.3,-3.0,4.3],[9.5,-4.1,7.8],[6.8,-2.1,9.7],[3.0,-2.7,10.3],[-0.1,-0.6,9.6],[-0.7,0.0,13.3],[2.8,1.6,13.6],[1.6,4.4,11.3],[-1.7,4.8,13.2],[-3.7,3.9,10.1],[-7.4,3.5,11.0],[-10.3,1.9,9.2],[-11.3,3.5,5.9],[-7.9,5.1,5.6],[-6.6,5.9,2.1],[-3.1,5.0,1.0],[-1.3,6.3,-2.1],[0.6,4.0,-4.5],[3.5,5.3,-6.5],[5.2,3.4,-9.3],[9.0,3.3,-9.8],[10.9,2.4,-13.0],[14.5,1.4,-13.4],[16.5,1.3,-16.7],[19.7,-0.6,-17.6]],[[-10.4,-3.5,8.6],[-10.8,-2.2,5.0],[-8.5,0.4,3.5],[-8.2,2.1,0.1],[-5.2,2.5,-2.2],[-5.3,5.2,-4.9],[-3.2,4.9,-8.1],[-1.5,7.5,-10.2],[-4.2,6.7,-12.9],[-7.0,7.6,-10.6],[-8.0,4.1,-9.7],[-9.1,3.1,-6.1],[-8.5,-0.4,-4.8],[-10.2,-1.7,-1.7],[-8.2,-4.2,0.5],[-9.1,-6.2,3.6],[-6.3,-6.0,6.2],[-5.6,-6.3,9.9],[-3.6,-3.6,11.9],[-0.9,-6.2,12.4],[-0.4,-6.7,8.7],[3.0,-5.7,7.5],[3.6,-3.2,4.6],[5.3,-6.0,2.7],[2.1,-8.0,3.2],[-0.0,-5.2,1.9],[2.2,-4.9,-1.2],[1.8,-8.6,-1.7],[-2.0,-8.2,-1.7],[-1.7,-5.5,-4.3],[0.5,-7.8,-6.4],[-2.1,-10.5,-6.3],[-4.8,-8.0,-7.5],[-2.9,-5.8,-10.0],[0.2,-7.8,-11.0],[2.6,-5.1,-10.0],[5.8,-6.6,-8.4],[6.3,-5.3,-4.8],[9.8,-4.0,-5.7],[8.2,-1.6,-8.1],[5.6,-0.4,-5.6],[5.9,2.5,-3.1],[3.2,3.1,-0.4],[2.8,6.5,1.1],[0.5,7.7,3.9],[0.0,11.2,5.2],[3.1,12.3,3.3],[5.4,9.6,4.7],[6.9,6.6,2.8],[6.0,3.3,4.5],[8.7,0.7,5.1],[8.4,-3.0,4.4],[9.5,-4.0,7.9],[6.8,-2.0,9.7],[3.0,-2.6,10.3],[-0.1,-0.6,9.6],[-0.7,0.1,13.4],[2.8,1.7,13.6],[1.5,4.4,11.3],[-1.8,4.8,13.2],[-3.7,3.8,10.0],[-7.4,3.4,10.9],[-10.4,1.8,9.1],[-11.3,3.5,5.8],[-7.8,5.1,5.6],[-6.6,6.0,2.1],[-3.1,5.0,1.0],[-1.3,6.3,-2.0],[0.6,4.0,-4.4],[3.6,5.2,-6.4],[5.0,3.2,-9.3],[8.8,3.3,-10.1],[10.0,2.4,-13.6],[13.6,1.8,-12.6],[15.7,-0.1,-10.1],[13.9,-3.3,-10.9]],[[-10.5,-3.5,8.6],[-10.9,-2.2,5.0],[-8.5,0.3,3.5],[-8.2,2.1,0.1],[-5.3,2.5,-2.3],[-5.3,5.2,-5.0],[-3.2,4.8,-8.2],[-1.4,7.3,-10.3],[-4.2,6.9,-12.9],[-7.0,7.8,-10.4],[-8.1,4.2,-9.7],[-9.1,3.2,-6.2],[-8.6,-0.4,-4.8],[-10.3,-1.8,-1.7],[-8.2,-4.1,0.5],[-9.0,-6.1,3.6],[-6.3,-5.8,6.2],[-5.5,-6.2,9.9],[-3.5,-3.6,12.0],[-0.9,-6.3,12.5],[-0.4,-6.8,8.8],[3.0,-5.7,7.5],[3.6,-3.3,4.7],[5.3,-6.1,2.7],[2.1,-8.1,3.2],[0.0,-5.2,1.9],[2.3,-4.9,-1.2],[1.8,-8.6,-1.7],[-1.9,-8.3,-1.7],[-1.6,-5.5,-4.3],[0.6,-7.8,-6.5],[-2.1,-10.5,-6.3],[-4.8,-8.0,-7.4],[-3.0,-5.8,-9.9],[0.0,-7.8,-11.0],[2.4,-5.1,-9.9],[5.7,-6.4,-8.4],[6.4,-5.2,-4.8],[9.9,-4.0,-5.7],[8.4,-1.4,-8.1],[5.8,-0.2,-5.6],[6.1,2.7,-3.1],[3.3,3.2,-0.5],[2.7,6.6,1.0],[0.5,7.7,3.9],[0.1,11.2,5.3],[3.2,12.3,3.3],[5.4,9.5,4.7],[6.9,6.6,2.8],[5.9,3.3,4.5],[8.7,0.7,5.1],[8.4,-3.1,4.4],[9.5,-4.0,7.9],[6.8,-2.0,9.7],[3.0,-2.6,10.3],[-0.1,-0.6,9.6],[-0.7,0.1,13.3],[2.7,1.7,13.6],[1.5,4.4,11.2],[-1.8,4.8,13.1],[-3.7,3.8,9.9],[-7.4,3.4,10.9],[-10.4,1.9,9.1],[-11.3,3.5,5.8],[-7.9,5.1,5.6],[-6.7,5.9,2.1],[-3.1,5.1,1.0],[-1.3,6.3,-2.1],[0.5,4.0,-4.4],[3.5,5.2,-6.5],[5.1,3.2,-9.3],[8.8,3.1,-9.9],[10.5,2.2,-13.2],[14.1,1.3,-14.3],[15.1,-1.3,-11.7],[14.0,-4.6,-10.1]],[[-10.4,-3.4,8.7],[-10.8,-2.2,5.1],[-8.4,0.4,3.5],[-8.2,2.1,0.1],[-5.2,2.5,-2.2],[-5.3,5.1,-5.0],[-3.2,4.7,-8.2],[-1.5,7.3,-10.4],[-4.2,6.7,-13.0],[-7.1,7.6,-10.7],[-8.0,4.0,-9.8],[-9.1,3.2,-6.2],[-8.6,-0.4,-4.8],[-10.2,-1.7,-1.6],[-8.2,-4.1,0.5],[-9.0,-6.1,3.7],[-6.3,-5.8,6.3],[-5.5,-6.2,10.0],[-3.5,-3.6,12.0],[-0.9,-6.2,12.6],[-0.4,-6.8,8.8],[3.0,-5.7,7.5],[3.5,-3.3,4.7],[5.2,-6.1,2.7],[2.0,-8.2,3.2],[-0.0,-5.3,1.9],[2.2,-5.0,-1.2],[1.8,-8.7,-1.8],[-2.0,-8.3,-1.8],[-1.6,-5.5,-4.3],[0.6,-7.8,-6.5],[-2.1,-10.4,-6.5],[-4.7,-7.9,-7.5],[-2.8,-5.7,-10.0],[0.2,-7.7,-11.1],[2.6,-5.0,-10.0],[5.8,-6.5,-8.5],[6.4,-5.3,-4.8],[9.9,-4.0,-5.7],[8.3,-1.5,-8.1],[5.7,-0.2,-5.5],[6.0,2.7,-3.1],[3.3,3.3,-0.5],[2.7,6.7,1.1],[0.4,7.7,3.9],[-0.0,11.2,5.3],[3.1,12.3,3.3],[5.3,9.6,4.8],[6.8,6.6,2.9],[5.9,3.3,4.6],[8.6,0.7,5.1],[8.3,-3.0,4.3],[9.4,-4.1,7.8],[6.7,-2.0,9.6],[3.0,-2.6,10.3],[-0.2,-0.5,9.6],[-0.7,0.1,13.4],[2.8,1.6,13.6],[1.6,4.4,11.3],[-1.7,4.8,13.2],[-3.7,3.9,10.1],[-7.4,3.5,10.9],[-10.4,1.9,9.2],[-11.3,3.5,5.9],[-7.9,5.1,5.6],[-6.6,5.9,2.1],[-3.1,4.9,1.0],[-1.3,6.2,-2.1],[0.6,3.9,-4.5],[3.6,5.2,-6.5],[5.2,3.3,-9.3],[9.0,3.4,-9.7],[9.4,2.6,-13.4],[10.9,5.9,-14.5],[13.6,8.3,-13.4],[11.1,11.0,-12.3]],[[-10.4,-3.5,8.6],[-10.8,-2.2,5.1],[-8.4,0.4,3.5],[-8.2,2.1,0.1],[-5.2,2.5,-2.2],[-5.3,5.1,-5.0],[-3.2,4.8,-8.2],[-1.5,7.4,-10.3],[-4.1,6.8,-13.0],[-7.0,7.7,-10.7],[-8.0,4.1,-9.8],[-9.1,3.2,-6.2],[-8.5,-0.3,-4.8],[-10.2,-1.7,-1.7],[-8.2,-4.1,0.5],[-9.1,-6.1,3.6],[-6.3,-5.9,6.2],[-5.6,-6.3,9.9],[-3.6,-3.7,12.0],[-0.9,-6.4,12.5],[-0.4,-6.8,8.8],[3.0,-5.7,7.5],[3.6,-3.3,4.7],[5.3,-6.0,2.7],[2.2,-8.1,3.2],[-0.0,-5.3,2.0],[2.2,-5.0,-1.1],[1.7,-8.7,-1.7],[-2.1,-8.3,-1.7],[-1.7,-5.5,-4.3],[0.5,-7.8,-6.4],[-2.2,-10.5,-6.3],[-4.9,-8.0,-7.5],[-2.9,-5.7,-10.0],[0.1,-7.8,-11.0],[2.6,-5.1,-10.0],[5.8,-6.6,-8.4],[6.4,-5.4,-4.8],[9.8,-4.0,-5.7],[8.2,-1.6,-8.2],[5.7,-0.3,-5.6],[6.0,2.6,-3.2],[3.3,3.2,-0.5],[2.8,6.6,1.0],[0.5,7.8,3.8],[-0.0,11.3,5.2],[3.1,12.4,3.3],[5.4,9.7,4.8],[7.0,6.8,2.9],[6.0,3.5,4.6],[8.7,0.9,5.2],[8.4,-2.8,4.4],[9.5,-3.8,7.9],[6.8,-1.8,9.7],[3.0,-2.6,10.3],[-0.2,-0.6,9.6],[-0.7,-0.1,13.4],[2.7,1.5,13.6],[1.5,4.2,11.3],[-1.8,4.6,13.2],[-3.7,3.8,10.1],[-7.4,3.4,11.0],[-10.4,1.8,9.2],[-11.3,3.5,5.9],[-7.9,5.1,5.6],[-6.6,5.9,2.1],[-3.1,5.0,1.0],[-1.3,6.3,-2.0],[0.6,4.0,-4.4],[3.6,5.3,-6.4],[5.4,3.5,-9.2],[9.2,3.4,-9.5],[11.3,2.8,-12.6],[14.9,1.7,-12.8],[17.2,1.9,-15.8],[20.2,-0.2,-16.7]],[[-10.3,-3.4,8.7],[-10.7,-2.1,5.1],[-8.4,0.4,3.5],[-8.2,2.2,0.1],[-5.2,2.5,-2.2],[-5.2,5.2,-5.0],[-3.1,4.8,-8.1],[-1.3,7.5,-10.1],[-3.9,6.8,-12.8],[-6.8,7.6,-10.5],[-7.9,4.1,-9.7],[-8.9,3.1,-6.2],[-8.4,-0.4,-4.8],[-10.0,-1.7,-1.6],[-8.1,-4.1,0.6],[-9.1,-6.1,3.6],[-6.3,-5.9,6.2],[-5.5,-6.3,9.9],[-3.6,-3.7,12.0],[-0.9,-6.3,12.6],[-0.4,-6.8,8.8],[3.0,-5.8,7.5],[3.5,-3.3,4.7],[5.2,-6.1,2.7],[2.1,-8.1,3.2],[-0.1,-5.2,1.9],[2.2,-4.9,-1.2],[1.8,-8.6,-1.7],[-2.0,-8.3,-1.7],[-1.7,-5.5,-4.3],[0.6,-7.8,-6.5],[-2.0,-10.5,-6.3],[-4.8,-8.1,-7.4],[-2.9,-5.9,-10.0],[0.2,-7.9,-11.0],[2.6,-5.1,-9.9],[5.8,-6.5,-8.3],[6.4,-5.2,-4.7],[9.8,-3.9,-5.7],[8.2,-1.5,-8.2],[5.6,-0.1,-5.7],[5.9,2.8,-3.3],[3.2,3.4,-0.6],[2.6,6.8,0.9],[0.4,7.8,3.9],[-0.1,11.3,5.2],[3.1,12.4,3.3],[5.3,9.5,4.7],[6.7,6.6,2.7],[5.8,3.3,4.4],[8.6,0.7,5.0],[8.2,-3.0,4.3],[9.4,-4.0,7.8],[6.7,-2.0,9.6],[3.0,-2.6,10.3],[-0.2,-0.6,9.7],[-0.7,-0.0,13.4],[2.8,1.5,13.6],[1.6,4.3,11.3],[-1.7,4.7,13.2],[-3.7,3.8,10.1],[-7.4,3.4,10.9],[-10.4,1.9,9.2],[-11.3,3.6,5.9],[-7.9,5.1,5.6],[-6.7,6.0,2.1],[-3.1,5.0,1.0],[-1.4,6.3,-2.1],[0.4,4.0,-4.6],[3.4,5.2,-6.7],[4.8,3.1,-9.5],[8.5,3.1,-10.3],[9.6,1.9,-13.8],[13.3,0.8,-14.1],[13.0,1.3,-17.9],[11.6,4.8,-17.4]]]};

  var N = DATA.ca.length;
  var SPIN_PERIOD = 32;                    // seconds per turn (structure, ensemble)
  var ROLL_PERIOD = 26;                    // seconds per turn (equivariance step)
  var PAIR = [43, 67];                     // Ile44 and His68: neighbouring strands, far apart in sequence
  var MSA_ROWS = 10;

  var BG = [7, 13, 28], CHALK = [242, 240, 230], AMBER = [255, 179, 107], BLUE = [140, 196, 240];
  var GREY = [198, 198, 192], RED = [255, 90, 54], CHART = [38, 58, 87];
  function ssColor(i) { var s = DATA.ss[i]; return s === 'H' ? AMBER : s === 'S' ? BLUE : GREY; }

  /* ---- data prep ------------------------------------------------------ */
  function centred(P) { return P.map(function (p) { return [p[0] - C0[0], p[1] - C0[1], p[2] - C0[2]]; }); }
  var C0 = [0, 0, 0];
  DATA.ca.forEach(function (p) { C0[0] += p[0] / N; C0[1] += p[1] / N; C0[2] += p[2] / N; });
  var CA = centred(DATA.ca), ENS = DATA.ens.map(centred);
  var RMAX = 0;
  CA.forEach(function (p) { RMAX = Math.max(RMAX, Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2])); });

  var DIST = [];
  (function () {
    for (var i = 0; i < N; i++) {
      DIST.push([]);
      for (var j = 0; j < N; j++) {
        var a = CA[i], b = CA[j];
        DIST[i].push(Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)));
      }
    }
  })();
  // Distances are sorted into bins, one shade per bin (the info panel explains them).
  var BINS = [{ max: 6, v: 1 }, { max: 8, v: 0.68 }, { max: 11, v: 0.4 }, { max: 14, v: 0.2 }];
  function shade(d) {
    for (var q = 0; q < BINS.length; q++) if (d < BINS[q].max) return BINS[q].v;
    return 0;
  }
  // Third residue for the triangle step: close to both members of PAIR, far along the chain from each.
  var THIRD = (function () {
    var best = -1, bd = 1e9;
    for (var k = 0; k < N; k++) {
      if (Math.abs(k - PAIR[0]) < 12 || Math.abs(k - PAIR[1]) < 12) continue;
      var d = DIST[PAIR[0]][k] + DIST[PAIR[1]][k];
      if (d < bd) { bd = d; best = k; }
    }
    return best;
  })();

  var seed = 20261116;
  function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  function gauss() { var u = 1 - rnd(), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  // Schematic alignment: true = this relative differs from the query at this position.
  // The two PAIR columns always change together.
  var MSA = [];
  (function () {
    for (var r = 0; r < MSA_ROWS; r++) {
      var row = [], both = r === 1 || r === 3 || r === 4 || r === 7 || r === 8;
      for (var c = 0; c < N; c++) row.push(rnd() < 0.16);
      row[PAIR[0]] = both; row[PAIR[1]] = both;
      MSA.push(row);
    }
  })();
  var NOISE = CA.map(function () { return [gauss() * 11, gauss() * 11, gauss() * 11]; });

  // Free-energy sketch: two wells, the left one deeper.
  var WELLS = [{ x: 0.3, n: 30 }, { x: 0.72, n: 7 }];
  function energy(x) {
    return -1.0 * Math.exp(-Math.pow((x - 0.3) / 0.115, 2)) - 0.48 * Math.exp(-Math.pow((x - 0.72) / 0.1, 2)) +
      14 * Math.pow(x - 0.5, 4);
  }
  var DOTS = (function () {                // pile positions (in dot diameters) and a mixed arrival order
    var out = [];
    WELLS.forEach(function (w, wi) {
      var left = w.n, row = 0;
      while (left > 0) {
        var cap = Math.min(row + 2, left);
        for (var q = 0; q < cap; q++) out.push({ w: wi, dx: q - (cap - 1) / 2, row: row, key: rnd() });
        left -= cap; row++;
      }
    });
    out.sort(function (a, b) { return a.key - b.key; });
    return out;
  })();

  /* ---- scenes: every channel is spelled out so any step can be
          restored exactly (Back restarts a step from its beginning) ---- */
  var CH = ['seq', 'box', 'tok', 'row', 'grid', 'fill', 'msa', 'co', 'tri', 'split', 'solo', 'str', 'con',
            'fr', 'noise', 'cof', 'ens', 'land'];
  function scene(o) {
    var s = { seq: 0, box: 1, tok: 1, row: 1, grid: 1, fill: 1, msa: 0, co: 0, tri: 0, split: 1, solo: 0,
              str: 0, con: 0, fr: 0, noise: 0, cof: 0, ens: 0, land: 0 };
    Object.keys(o).forEach(function (k) { s[k] = o[k]; });
    return s;
  }
  var SCENES = {
    goal:      scene({ seq: 1, box: 0, tok: 0, grid: 0, fill: 0, split: 0, str: 1 }),
    tokens:    scene({ seq: 0.5, tok: 0, grid: 0, fill: 0, split: 0 }),
    pair:      scene({ fill: 0, split: 0, delay: { grid: 900 } }),
    msa:       scene({ fill: 0, split: 0, msa: 1 }),
    coevo:     scene({ fill: 0, split: 0, msa: 1, co: 1 }),
    contacts:  scene({ info: true, split: 0, msa: 1, co: 1 }),
    triangle:  scene({ info: true, split: 0, msa: 1, tri: 1 }),
    structure: scene({ info: true, str: 1, con: 1, spin: true, delay: { str: 1300, con: 2600 } }),
    ipa:       scene({ info: true, str: 1, fr: 1, roll: true }),
    diffusion: scene({ info: true, str: 1, spin: true, kick: { noise: 1 } }),
    cofold:    scene({ row: 0, grid: 0, cof: 1 }),
    snapshot:  scene({ row: 0, grid: 0, solo: 1, str: 1, spin: true }),
    ensemble:  scene({ row: 0, grid: 0, solo: 1, str: 1, ens: 1, spin: true }),
    landscape: scene({ row: 0, grid: 0, solo: 1, land: 1, done: true })
  };
  var DUR = { seq: 900, box: 900, tok: 1900, row: 800, grid: 1000, fill: 4600, msa: 1500, co: 1300, tri: 1300,
              split: 1900, solo: 1700, str: 1400, con: 1000, fr: 1200, noise: 7000, cof: 1300, ens: 6500, land: 6500 };

  /* ---- build the figure from the caption list ----------------------- */
  var steps = Array.prototype.slice.call(el.querySelectorAll('.story__steps > li'));
  if (!steps.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stage = document.createElement('div');
  stage.className = 'story__stage';
  var canvas = document.createElement('canvas');
  stage.appendChild(canvas);
  var done = document.createElement('div');
  done.className = 'story__done';
  done.textContent = el.getAttribute('data-done') || 'Scroll down to keep reading';
  stage.appendChild(done);

  // "What is this?" opens the explanation of the map (its text lives in the post's HTML).
  var info = el.querySelector('.story__info');
  var what = button('story__what', 'What is this?');
  var closeInfo = button('story__info-close', 'Close');
  if (info) {
    stage.appendChild(what);
    info.insertBefore(closeInfo, info.firstChild);
    info.setAttribute('role', 'dialog');
    info.setAttribute('aria-label', 'How to read the map');
    info.tabIndex = -1;
  }
  function showInfo(on) {
    if (!info) return;
    info.hidden = !on;
    what.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) { drawExamples(); info.scrollTop = 0; info.focus(); } else if (document.activeElement === closeInfo) what.focus();
  }

  var panel = document.createElement('div');
  panel.className = 'story__panel';
  var caption = document.createElement('p');
  caption.className = 'story__caption';
  caption.setAttribute('aria-live', 'polite');
  var controls = document.createElement('div');
  controls.className = 'story__controls';
  var back = button('story__back', 'Back');
  var count = document.createElement('span');
  count.className = 'story__count';
  var hint = document.createElement('span');
  hint.className = 'story__hint';
  hint.textContent = 'Click or press space';
  var next = button('story__next', 'Next');
  controls.appendChild(back); controls.appendChild(count); controls.appendChild(hint); controls.appendChild(next);
  panel.appendChild(caption); panel.appendChild(controls);

  el.querySelector('.story__steps').hidden = true;
  el.appendChild(stage);
  el.appendChild(panel);

  function button(cls, label) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = label;
    return b;
  }
  function sceneAt(i) { return SCENES[steps[i].getAttribute('data-scene')] || SCENES.goal; }

  /* ---- channels, tweens, rotation ----------------------------------- */
  var cur = {};
  CH.forEach(function (c) { cur[c] = sceneAt(0)[c]; });
  var tweens = {};
  var index = -1, raf = 0, last = 0;
  var ang = 0, rol = 0, spin = false, roll = false;

  // restart = true: jump to where this step begins, then play it forward.
  function go(i, restart) {
    i = Math.max(0, Math.min(steps.length - 1, i));
    if (i === index && !restart) return;
    var sc = sceneAt(i);
    var now = performance.now();
    if (restart) {
      var from = i > 0 ? sceneAt(i - 1) : sc;
      CH.forEach(function (c) { cur[c] = from[c]; });
      tweens = {};
      ang = 0; rol = 0;
    }
    index = i;
    if (sc.kick && !reduce) Object.keys(sc.kick).forEach(function (c) { cur[c] = sc.kick[c]; });

    CH.forEach(function (c) {
      if (sc[c] === cur[c]) { delete tweens[c]; return; }
      var delay = (!reduce && sc.delay && sc.delay[c]) || 0;
      tweens[c] = { from: cur[c], to: sc[c], start: now + delay, dur: reduce ? 0 : DUR[c] };
    });
    spin = !!sc.spin && !reduce;
    roll = !!sc.roll && !reduce;

    done.classList.toggle('is-on', !!sc.done);
    what.classList.toggle('is-on', !!sc.info);
    what.tabIndex = sc.info ? 0 : -1;
    showInfo(false);
    caption.innerHTML = steps[i].innerHTML;
    count.textContent = (i + 1) + ' / ' + steps.length;
    back.disabled = i === 0;
    next.disabled = i === steps.length - 1;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function turn(a, on, period, dt) {       // advance while on; otherwise glide home to the front view
    if (on) return a + dt / 1000 * (2 * Math.PI / period);
    if (a === 0) return 0;
    var home = Math.round(a / (2 * Math.PI)) * 2 * Math.PI;
    a += (home - a) * Math.min(1, dt / 320);
    return Math.abs(home - a) < 0.003 ? 0 : a;
  }

  function frame(now) {
    raf = 0;
    var dt = last ? Math.min(now - last, 100) : 16;
    last = now;
    var active = false;
    Object.keys(tweens).forEach(function (c) {
      var tw = tweens[c];
      var t = tw.dur ? (now - tw.start) / tw.dur : 1;
      if (t < 0) { active = true; return; }
      if (t >= 1) { cur[c] = tw.to; delete tweens[c]; return; }
      cur[c] = tw.from + (tw.to - tw.from) * (c === 'noise' || c === 'ens' || c === 'land' ? t : ease(t));
      active = true;
    });
    ang = turn(ang, spin, SPIN_PERIOD, dt);
    rol = turn(rol, roll, ROLL_PERIOD, dt);
    if (spin || roll || ang !== 0 || rol !== 0) active = true;
    draw();
    if (active) raf = requestAnimationFrame(frame); else last = 0;
  }

  /* ---- drawing helpers ------------------------------------------------ */
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0;
  var mapCanvas = document.createElement('canvas');
  mapCanvas.width = N; mapCanvas.height = N;
  var mapCtx = mapCanvas.getContext('2d');
  var mapImg = mapCtx.createImageData(N, N);

  function resize() {
    var r = stage.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function rgb(c, f) {                                    // f < 1 sinks the colour into the background
    f = f === undefined ? 1 : f;
    return 'rgb(' + Math.round(BG[0] + (c[0] - BG[0]) * f) + ',' + Math.round(BG[1] + (c[1] - BG[1]) * f) + ',' +
      Math.round(BG[2] + (c[2] - BG[2]) * f) + ')';
  }
  function label(text, x, y, alpha, align) {
    if (alpha < 0.01) return;
    var fs = Math.max(9, Math.min(W * 0.0135, 12));
    ctx.font = '600 ' + fs + 'px "Albert Sans", sans-serif';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.12em';
    ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
    ctx.globalAlpha = alpha;
    ctx.fillStyle = rgb(AMBER);
    ctx.fillText(text.toUpperCase(), x, y);
    ctx.globalAlpha = 1;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  }

  function layout() {
    var S0 = Math.min(H * 0.6, W * 0.84);
    var S = lerp(S0, Math.min(S0, W * 0.42), cur.split);
    var cell = S / N;
    var rowH = Math.max(4, cell * 1.5);
    var gap = Math.max(4, H * 0.014);
    var msaH = H * 0.17 * cur.msa;
    var total = msaH + (cur.msa > 0 ? gap * cur.msa : 0) + rowH + gap + S;
    var top = (H - total) / 2 + H * 0.01;
    var mapY = top + msaH + gap * cur.msa + rowH + gap;
    var mapX = lerp(W / 2, W * 0.275, cur.split) - S / 2 + rowH / 2;
    // structure: under the sequence (goal), right of the map (split), alone in the middle (solo)
    var sx = lerp(lerp(W / 2, W * 0.75, cur.split), W / 2, cur.solo);
    var sy = lerp(lerp(H * 0.66, H * 0.5, cur.split), H * 0.47, cur.solo);
    var sr = lerp(lerp(H * 0.3, Math.min(H * 0.4, W * 0.23), cur.split), Math.min(H * 0.42, W * 0.44), cur.solo);
    return { S: S, cell: cell, rowH: rowH, gap: gap, msaTop: top, msaH: msaH, rowY: mapY - gap - rowH,
             mapX: mapX, mapY: mapY, sx: sx, sy: sy, k: sr / RMAX };
  }

  // Rotate (yaw then roll) and project a list of 3D points.
  function project(P, L) {
    var cy = Math.cos(ang), syv = Math.sin(ang), cr = Math.cos(rol), sr = Math.sin(rol);
    return P.map(function (p) {
      var x = p[0] * cy + p[2] * syv, z = -p[0] * syv + p[2] * cy, y = p[1];
      return { x: L.sx + (x * cr - y * sr) * L.k, y: L.sy - (x * sr + y * cr) * L.k, z: z };
    });
  }

  // Smooth backbone trace through projected C-alpha points, back to front.
  // tint: 0 = chalk, 1 = secondary-structure colours. dim sinks it into the background.
  function drawTrace(R, L, alpha, width, tint, dim) {
    if (alpha < 0.01) return;
    var SUB = 4, pts = [], i, s;
    function crs(a, b, c, d, t) {
      var t2 = t * t, t3 = t2 * t;
      return 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
    }
    for (i = 0; i < N - 1; i++) {
      var p0 = R[Math.max(i - 1, 0)], p1 = R[i], p2 = R[i + 1], p3 = R[Math.min(i + 2, N - 1)];
      for (s = 0; s < SUB + (i === N - 2 ? 1 : 0); s++) {
        var u = s / SUB;
        pts.push({ x: crs(p0.x, p1.x, p2.x, p3.x, u), y: crs(p0.y, p1.y, p2.y, p3.y, u),
                   z: crs(p0.z, p1.z, p2.z, p3.z, u), r: u < 0.5 ? i : i + 1 });
      }
    }
    var order = [];
    for (i = 0; i < pts.length - 1; i++) order.push(i);
    order.sort(function (a, b) { return pts[a].z - pts[b].z; });
    ctx.lineCap = 'round';
    ctx.lineWidth = width;
    ctx.globalAlpha = alpha;
    order.forEach(function (j) {
      var a = pts[j], b = pts[j + 1];
      var depth = 0.55 + 0.45 * clamp01((a.z + RMAX) / (2 * RMAX));
      ctx.strokeStyle = rgb(mix(CHALK, ssColor(a.r), tint), depth * dim);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  function markCell(L, r, c, alpha) {      // red ring around one cell of the map
    var s = Math.max(L.cell * 2.6, 9);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = rgb(RED); ctx.lineWidth = 1.5;
    ctx.strokeRect(L.mapX + (c + 0.5) * L.cell - s / 2, L.mapY + (r + 0.5) * L.cell - s / 2, s, s);
    ctx.globalAlpha = 1;
  }

  /* ---- info panel: bin legend and two toy chains ---------------------- */
  var EXAMPLES = {
    line: function (i) { return [i * 3.8, 0]; },                                   // a straight chain
    hairpin: function (i) { return i < 6 ? [i * 3.8, 0] : [(11 - i) * 3.8, 4.8]; } // the same chain folded in half
  };
  function drawExamples() {
    if (!info) return;
    Array.prototype.forEach.call(info.querySelectorAll('[data-bin]'), function (sw) {
      var q = +sw.getAttribute('data-bin');
      sw.style.background = rgb(CHALK, q < BINS.length ? BINS[q].v : 0.045);
    });
    Array.prototype.forEach.call(info.querySelectorAll('canvas[data-example]'), function (cv) {
      var fn = EXAMPLES[cv.getAttribute('data-example')];
      if (!fn) return;
      var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = r.width, h = r.height, c = cv.getContext('2d'), n = 12, i, j;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      var P = []; for (i = 0; i < n; i++) P.push(fn(i));
      // left: the chain
      var xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; });
      var minX = Math.min.apply(0, xs), maxX = Math.max.apply(0, xs), midY = (Math.min.apply(0, ys) + Math.max.apply(0, ys)) / 2;
      var cw = w * 0.5, k = Math.min(cw * 0.84 / (11 * 3.8), 9), ox = cw / 2 - (minX + maxX) / 2 * k, oy = h / 2 + midY * k;
      c.strokeStyle = rgb(CHALK, 0.5); c.lineWidth = 1.5; c.lineJoin = 'round';
      c.beginPath();
      P.forEach(function (p, q) { var X = ox + p[0] * k, Y = oy - p[1] * k; if (q) c.lineTo(X, Y); else c.moveTo(X, Y); });
      c.stroke();
      c.fillStyle = rgb(CHALK);
      P.forEach(function (p) { c.beginPath(); c.arc(ox + p[0] * k, oy - p[1] * k, Math.max(2.5, k * 1.25), 0, Math.PI * 2); c.fill(); });
      // right: its map, shaded with the same bins
      var S = Math.min(h * 0.92, w * 0.42), mx = w * 0.75 - S / 2, my = (h - S) / 2, cs = S / n;
      c.fillStyle = rgb(CHALK, 0.045); c.fillRect(mx, my, S, S);
      for (i = 0; i < n; i++) for (j = 0; j < n; j++) {
        var d = Math.sqrt(Math.pow(P[i][0] - P[j][0], 2) + Math.pow(P[i][1] - P[j][1], 2)), v = shade(d);
        if (!v) continue;
        c.fillStyle = rgb(CHALK, v);
        c.fillRect(mx + j * cs, my + i * cs, cs + 0.5, cs + 0.5);
      }
      c.strokeStyle = rgb(CHART); c.lineWidth = 1; c.strokeRect(mx + 0.5, my + 0.5, S - 1, S - 1);
    });
  }

  /* ---- the picture ---------------------------------------------------- */
  function draw() {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    var L = layout(), i, j;
    var a = PAIR[0], b = PAIR[1];

    /* -- sequence letters and token row -- */
    if (cur.row > 0.01) {
      var cols = W < 520 ? 26 : 38;
      var c0 = W * 0.86 / cols, rows = Math.ceil(N / cols);
      var e = cur.tok;
      var tint = cur.str * cur.split;
      for (i = 0; i < N; i++) {
        var x0 = W / 2 + ((i % cols) - (cols - 1) / 2) * c0, y0 = H * 0.2 + (Math.floor(i / cols) - (rows - 1) / 2) * c0 * 1.25;
        var x1 = L.mapX + (i + 0.5) * L.cell, y1 = L.rowY + L.rowH / 2;
        var x = lerp(x0, x1, e), y = lerp(y0, y1, e);
        var w = lerp(c0 * 0.86, Math.max(L.cell - 0.6, L.cell * 0.8), e), h = lerp(c0 * 0.86, L.rowH, e);
        if (cur.box > 0.01) {
          ctx.globalAlpha = cur.row * cur.box * lerp(0.16, 0.9, e);
          ctx.fillStyle = rgb(mix(CHALK, ssColor(i), tint));
          ctx.fillRect(x - w / 2, y - h / 2, w, h);
          if (e < 0.5) {
            ctx.globalAlpha = cur.row * cur.box * (1 - e * 2) * 0.7;
            ctx.strokeStyle = rgb(CHALK); ctx.lineWidth = 1;
            ctx.strokeRect(x - w / 2 + 0.5, y - h / 2 + 0.5, w - 1, h - 1);
          }
        }
        if (cur.seq > 0.01 && e < 0.6) {
          ctx.globalAlpha = cur.row * cur.seq * (1 - e / 0.6);
          ctx.fillStyle = rgb(CHALK);
          ctx.font = '500 ' + Math.max(6, c0 * 0.62) + 'px "Albert Sans", sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(DATA.seq[i], x, y + 0.5);
        }
        // the same tokens again down the side of the grid
        var side = cur.row * cur.grid * e * e;
        if (side > 0.01) {
          ctx.globalAlpha = side * 0.9;
          ctx.fillStyle = rgb(mix(CHALK, ssColor(i), tint));
          var hh = Math.max(L.cell - 0.6, L.cell * 0.8);
          ctx.fillRect(L.mapX - L.gap - L.rowH, L.mapY + (i + 0.5) * L.cell - hh / 2, L.rowH, hh);
        }
      }
      ctx.globalAlpha = 1;
      // sequence -> structure arrow (first step only)
      var arrowA = cur.seq * cur.str * (1 - cur.tok) * (1 - cur.split) * (1 - cur.box);
      if (arrowA > 0.01) {
        var ay = H * 0.2 + rows * c0 * 0.62 + H * 0.035, by = ay + H * 0.07;
        ctx.globalAlpha = arrowA; ctx.strokeStyle = rgb(AMBER); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(W / 2, ay); ctx.lineTo(W / 2, by);
        ctx.moveTo(W / 2 - 5, by - 6); ctx.lineTo(W / 2, by); ctx.lineTo(W / 2 + 5, by - 6); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    /* -- alignment of related sequences (schematic) -- */
    if (cur.msa > 0.01 && cur.grid > 0.01) {
      var rh = L.msaH / MSA_ROWS;
      for (j = 0; j < MSA_ROWS; j++) {
        var ry = L.msaTop + (MSA_ROWS - 1 - j) * rh;      // relatives stack upward from the query
        var ra = cur.msa * cur.grid * clamp01(cur.msa * (MSA_ROWS + 2) - j);
        ctx.globalAlpha = ra * 0.13;
        ctx.fillStyle = rgb(CHALK);
        ctx.fillRect(L.mapX, ry + rh * 0.14, L.S, rh * 0.72);
        for (i = 0; i < N; i++) {
          if (!MSA[j][i]) continue;
          var hot = (i === a || i === b) ? cur.co : 0;
          ctx.globalAlpha = ra * 0.8;
          ctx.fillStyle = rgb(mix(CHALK, RED, hot));
          ctx.fillRect(L.mapX + i * L.cell, ry + rh * 0.14, Math.max(L.cell - 0.5, L.cell * 0.8), rh * 0.72);
        }
      }
      ctx.globalAlpha = 1;
    }

    /* -- pair grid / distance map -- */
    if (cur.grid > 0.01) {
      ctx.globalAlpha = cur.grid;
      ctx.fillStyle = rgb(CHALK, 0.045);
      ctx.fillRect(L.mapX, L.mapY, L.S, L.S);
      if (cur.fill > 0.001) {
        var px = mapImg.data;
        for (i = 0; i < N; i++) for (j = 0; j < N; j++) {
          // local contacts appear first, long-range ones last
          var rev = clamp01(cur.fill * 1.7 - 0.7 * Math.abs(i - j) / (N - 1)) ;
          var v = shade(DIST[i][j]) * ease(rev);
          var o = (i * N + j) * 4;
          px[o] = CHALK[0]; px[o + 1] = CHALK[1]; px[o + 2] = CHALK[2]; px[o + 3] = Math.round(255 * v);
        }
        mapCtx.putImageData(mapImg, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(mapCanvas, L.mapX, L.mapY, L.S, L.S);
      }
      ctx.strokeStyle = rgb(CHART); ctx.lineWidth = 1;
      ctx.strokeRect(L.mapX + 0.5, L.mapY + 0.5, L.S - 1, L.S - 1);
      ctx.globalAlpha = 1;

      var underY = L.mapY + L.S + Math.max(12, H * 0.035);
      var mcx = L.mapX + L.S / 2;
      label('Pair grid · one cell per pair', mcx, underY, cur.grid * (1 - clamp01(cur.fill * 3)) * (1 - cur.split));
      label('Bright = close together', mcx, underY, cur.grid * clamp01(cur.fill * 3 - 2) * (1 - cur.fr) * (1 - cur.split));
      label('The map does not change', mcx, underY, cur.grid * cur.fr);

      // co-evolving columns point at their cell
      if (cur.co > 0.01) {
        var xa = L.mapX + (a + 0.5) * L.cell, xb = L.mapX + (b + 0.5) * L.cell;
        var ya = L.mapY + (a + 0.5) * L.cell;
        ctx.globalAlpha = cur.co * 0.75; ctx.strokeStyle = rgb(RED); ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xb, L.msaTop); ctx.lineTo(xb, ya);
        ctx.moveTo(xa, L.msaTop); ctx.lineTo(xa, ya); ctx.lineTo(xb, ya);
        ctx.stroke();
        ctx.globalAlpha = 1;
        markCell(L, a, b, cur.co);
      }
      // triangle: three pairs that must agree with each other
      if (cur.tri > 0.01) {
        var t3 = [a, b, THIRD].sort(function (p, q) { return p - q; });
        var cells = [[t3[0], t3[1]], [t3[1], t3[2]], [t3[0], t3[2]]];
        ctx.globalAlpha = cur.tri * 0.8; ctx.strokeStyle = rgb(RED); ctx.lineWidth = 1;
        ctx.beginPath();
        cells.forEach(function (c, n) {
          var cx = L.mapX + (c[1] + 0.5) * L.cell, cy = L.mapY + (c[0] + 0.5) * L.cell;
          if (n === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
        });
        ctx.closePath(); ctx.stroke();
        ctx.globalAlpha = 1;
        cells.forEach(function (c) { markCell(L, c[0], c[1], cur.tri); });
      }
      if (cur.con > 0.01) { markCell(L, a, b, cur.con); markCell(L, b, a, cur.con); }
    }

    /* -- structure -- */
    if (cur.str > 0.01) {
      var s = cur.noise > 0 ? Math.cos((1 - cur.noise) * Math.PI / 2) : 0;   // noise level, as in the home intro
      var sig = Math.sqrt(1 - s * s);
      var P = s > 0 ? CA.map(function (p, n) {
        return [sig * p[0] + s * NOISE[n][0], sig * p[1] + s * NOISE[n][1], sig * p[2] + s * NOISE[n][2]];
      }) : CA;
      var R = project(P, L);
      var lw = Math.max(2, L.k * 1.05);
      var goalDim = lerp(1, 0.55, cur.fr);
      var shown = clamp01(1 - cur.ens * 0.75);

      // ensemble: the ten NMR models, one after another
      if (cur.ens > 0.001) {
        ENS.forEach(function (M, m) {
          var ma = clamp01(cur.ens * (ENS.length + 1) - m);
          drawTrace(project(M, L), L, cur.str * ma, Math.max(1.5, lw * 0.6), 1, 0.8);
        });
        label('Ten NMR models of ubiquitin · PDB 1D3Z', L.sx, Math.min(H - 14, L.sy + RMAX * L.k + Math.max(14, H * 0.05)), cur.str * clamp01(cur.ens * 4));
      }
      if (s > 0.02) {                                       // denoising: points first, the chain as they settle
        ctx.fillStyle = rgb(CHALK);
        R.forEach(function (p) {
          ctx.globalAlpha = cur.str * clamp01(s * 3) * 0.9;
          ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.6, L.k * 0.5), 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
      drawTrace(R, L, cur.str * shown * Math.pow(1 - s, 2), lw, 1, goalDim);

      // one local frame per residue (every third drawn)
      if (cur.fr > 0.01) {
        var F = project(CA.map(function (p, n) {
          var q = CA[Math.min(n + 1, N - 1)], r0 = CA[Math.max(n - 1, 0)];
          var d = [q[0] - r0[0], q[1] - r0[1], q[2] - r0[2]], l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]) || 1;
          return [p[0] + d[0] / l * 2.6, p[1] + d[1] / l * 2.6, p[2] + d[2] / l * 2.6];
        }), L);
        ctx.lineCap = 'round'; ctx.lineWidth = 1.4;
        for (i = 1; i < N - 1; i += 3) {
          var o2 = R[i], f = F[i], dx = f.x - o2.x, dy = f.y - o2.y;
          ctx.globalAlpha = cur.fr * cur.str;
          ctx.strokeStyle = rgb(CHALK);
          ctx.beginPath(); ctx.moveTo(o2.x, o2.y); ctx.lineTo(f.x, f.y); ctx.stroke();
          ctx.strokeStyle = rgb(RED);
          ctx.beginPath(); ctx.moveTo(o2.x, o2.y); ctx.lineTo(o2.x - dy * 0.8, o2.y + dx * 0.8); ctx.stroke();
          ctx.fillStyle = rgb(CHALK);
          ctx.beginPath(); ctx.arc(o2.x, o2.y, 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        label('Turn the protein', L.sx, L.sy + RMAX * L.k * 0.86 + Math.max(12, H * 0.035), cur.fr * cur.str);
      }
      // the highlighted contact, drawn in space
      if (cur.con > 0.01) {
        ctx.globalAlpha = cur.con * cur.str; ctx.strokeStyle = rgb(RED); ctx.fillStyle = rgb(RED); ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(R[a].x, R[a].y); ctx.lineTo(R[b].x, R[b].y); ctx.stroke();
        ctx.setLineDash([]);
        [a, b].forEach(function (n) { ctx.beginPath(); ctx.arc(R[n].x, R[n].y, Math.max(3, lw * 0.9), 0, Math.PI * 2); ctx.fill(); });
        ctx.globalAlpha = 1;
      }
    }

    /* -- co-folding: one token list for every molecule (schematic) -- */
    if (cur.cof > 0.01) {
      var G = [{ n: 14, shape: 0, name: 'amino acid' }, { n: 8, shape: 1, name: 'nucleotide' }, { n: 6, shape: 2, name: 'ligand atom' }];
      var T = 28, Sc = Math.min(H * 0.52, W * 0.6), cc = Sc / T;
      var gx = W / 2 - Sc / 2 + cc * 0.9, gy = H * 0.5 - Sc / 2 + cc * 0.2;
      ctx.globalAlpha = cur.cof;
      var shape = function (kind, x, y, r) {
        ctx.beginPath();
        if (kind === 0) ctx.rect(x - r, y - r, 2 * r, 2 * r);
        else if (kind === 1) { ctx.moveTo(x, y - r * 1.25); ctx.lineTo(x + r * 1.25, y); ctx.lineTo(x, y + r * 1.25); ctx.lineTo(x - r * 1.25, y); ctx.closePath(); }
        else ctx.arc(x, y, r * 0.85, 0, Math.PI * 2);
        ctx.fill();
      };
      var starts = [], acc = 0;
      G.forEach(function (g) { starts.push(acc); acc += g.n; });
      G.forEach(function (g, gi) {
        G.forEach(function (g2, gj) {
          var bx = gx + starts[gj] * cc, byy = gy + starts[gi] * cc, bw = g2.n * cc, bh = g.n * cc;
          if (gi === gj) { ctx.fillStyle = rgb(CHALK, 0.2); ctx.fillRect(bx + 1, byy + 1, bw - 2, bh - 2); }
          else {
            ctx.fillStyle = rgb(RED, 0.16); ctx.fillRect(bx + 1, byy + 1, bw - 2, bh - 2);
            ctx.strokeStyle = rgb(RED); ctx.lineWidth = 1.2; ctx.strokeRect(bx + 1.5, byy + 1.5, bw - 3, bh - 3);
          }
        });
        ctx.fillStyle = rgb(CHALK);
        for (var q = 0; q < g.n; q++) {
          shape(g.shape, gx + (starts[gi] + q + 0.5) * cc, gy - cc * 0.9, cc * 0.34);
          shape(g.shape, gx - cc * 0.9, gy + (starts[gi] + q + 0.5) * cc, cc * 0.34);
        }
      });
      // legend
      var ly = gy + Sc + Math.max(16, H * 0.06), fsz = Math.max(9, Math.min(W * 0.0135, 12));
      var lw2 = W * (W < 520 ? 0.3 : 0.2);
      G.forEach(function (g, gi) {
        var lx = W / 2 + (gi - 1) * lw2;
        ctx.globalAlpha = cur.cof; ctx.fillStyle = rgb(CHALK);
        shape(g.shape, lx - lw2 * 0.42, ly, fsz * 0.36);
        label(g.name, lx - lw2 * 0.42 + fsz * 0.9, ly, cur.cof, 'left');
      });
      ctx.globalAlpha = 1;
    }

    /* -- free-energy sketch: where the samples pile up (schematic) -- */
    if (cur.land > 0.001) {
      var x0l = W * 0.12, x1l = W * 0.88, yTop = H * 0.2, unit = H * 0.27;
      var yOf = function (x) { return yTop + (0.875 - energy(x)) * unit; };   // lower energy sits lower
      var la = clamp01(cur.land * 5);
      ctx.globalAlpha = la; ctx.strokeStyle = rgb(CHALK); ctx.lineWidth = 1.6; ctx.lineJoin = 'round';
      ctx.beginPath();
      for (i = 0; i <= 120; i++) {
        var xx = i / 120, X = lerp(x0l, x1l, xx), Y = yOf(xx);
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      var d = Math.max(4, Math.min(W * 0.012, 9));
      ctx.fillStyle = rgb(CHALK);
      DOTS.forEach(function (dot, n) {
        var w = WELLS[dot.w];
        var da = clamp01(cur.land * (DOTS.length + 6) - 4 - n);
        if (da <= 0) return;
        var X = lerp(x0l, x1l, w.x) + dot.dx * d, Yb = yOf(w.x) - d * 0.75 - dot.row * d * 0.9;
        ctx.globalAlpha = da * 0.92;
        ctx.beginPath(); ctx.arc(X, Yb - (1 - da) * d * 3, d * 0.4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      var lay = yOf(0.3) + Math.max(16, H * 0.055), endA = clamp01(cur.land * 4 - 3);
      label('Free energy', x0l, yTop - Math.max(16, H * 0.06), la, 'left');
      label('Visited often', lerp(x0l, x1l, 0.3), lay, endA);
      label('Visited rarely', lerp(x0l, x1l, 0.72), lay, endA);
      // the gap between the two wells
      var gxr = lerp(x0l, x1l, 0.9), yA = yOf(0.3), yB = yOf(0.72);
      ctx.globalAlpha = endA; ctx.strokeStyle = rgb(RED); ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(lerp(x0l, x1l, 0.3), yA); ctx.lineTo(gxr, yA); ctx.moveTo(lerp(x0l, x1l, 0.72), yB); ctx.lineTo(gxr, yB); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(gxr, yA); ctx.lineTo(gxr, yB); ctx.stroke();
      ctx.globalAlpha = 1;
      if (endA > 0.01) {
        ctx.globalAlpha = endA; ctx.fillStyle = rgb(RED);
        ctx.font = 'italic ' + Math.max(13, Math.min(W * 0.022, 19)) + 'px "Gentium Book Plus", serif';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText('ΔG', gxr + 8, (yA + yB) / 2);
        ctx.globalAlpha = 1;
      }
    }
  }

  /* ---- input ---------------------------------------------------------- */
  what.addEventListener('click', function (e) { e.stopPropagation(); showInfo(true); });
  closeInfo.addEventListener('click', function () { showInfo(false); });
  stage.addEventListener('click', function () { go(index + 1); });
  next.addEventListener('click', function () { go(index + 1); });
  back.addEventListener('click', function () { go(index - 1, true); });

  var inView = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].intersectionRatio >= 0.6;
    }, { threshold: [0, 0.6, 1] }).observe(stage);
  }
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (info && !info.hidden) {                         // the explanation is open: Escape closes, nothing advances
      if (e.key === 'Escape') showInfo(false);
      return;
    }
    var focused = el.contains(document.activeElement);
    if (!inView && !focused) return;
    var atEnd = index === steps.length - 1;
    if ((e.key === ' ' || e.code === 'Space') && !atEnd) {
      if (t && t.tagName === 'BUTTON') return;          // let buttons handle their own space
      e.preventDefault(); go(index + 1);
    } else if (e.key === 'ArrowRight' && focused) { go(index + 1); }
    else if (e.key === 'ArrowLeft' && focused) { go(index - 1, true); }
  });

  window.addEventListener('resize', function () { if (info && !info.hidden) drawExamples(); });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize', resize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

  resize();
  go(0);
})();
