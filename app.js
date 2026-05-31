
const pieces={P:'♙',N:'♘',B:'♗',R:'♖',Q:'♕',K:'♔',p:'♟',n:'♞',b:'♝',r:'♜',q:'♛',k:'♚'};
let puzzle,selected=null,boardState=[];

async function loadPuzzle(){
 const id=new URLSearchParams(location.search).get('p')||'cache01';
 puzzle=await (await fetch(`puzzles/${id}.json`)).json();
 document.getElementById('title').textContent=puzzle.title;
 document.getElementById('description').textContent=puzzle.description;
 loadFen(puzzle.fen);
 drawBoard();
}
function loadFen(fen){
 const rows=fen.split(' ')[0].split('/');
 boardState=[];
 for(const r of rows){
  const row=[];
  for(const c of r){
   if(!isNaN(c)){for(let i=0;i<+c;i++)row.push('');}
   else row.push(c);
  }
  boardState.push(row);
 }
}
function drawBoard(){
 const b=document.getElementById('board'); b.innerHTML='';
 for(let r=0;r<8;r++)for(let c=0;c<8;c++){
  const sq=document.createElement('div');
  sq.className='square '+(((r+c)%2)?'dark':'light');
  sq.dataset.r=r; sq.dataset.c=c;
  sq.textContent=pieces[boardState[r][c]]||'';
  sq.onclick=clickSquare;
  b.appendChild(sq);
 }
}
function coord(r,c){ return 'abcdefgh'[c]+(8-r); }
function clickSquare(e){
 const r=+e.currentTarget.dataset.r,c=+e.currentTarget.dataset.c;
 if(!selected && boardState[r][c]){
   selected={r,c}; e.currentTarget.classList.add('selected'); return;
 }
 if(selected){
   const from=coord(selected.r,selected.c);
   const to=coord(r,c);
   if(from===puzzle.solution.from && to===puzzle.solution.to){
      document.getElementById('status').textContent='✅ Correcto';
      document.getElementById('success').classList.remove('hidden');
      document.getElementById('coordinates').innerHTML=`<p>${puzzle.coordinates.lat}</p><p>${puzzle.coordinates.lon}</p>`;
   } else {
      document.getElementById('status').textContent='❌ Movimiento incorrecto';
   }
   selected=null;
   drawBoard();
 }
}
loadPuzzle();
