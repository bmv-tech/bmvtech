// BMV.TECH — interactions, portfolio, aperçu des images et vidéos
const slides = [...document.querySelectorAll('.slide')];
const dotsBox = document.getElementById('slideDots');
let currentSlide = 0;
let slideTimer;
 
if (slides.length && dotsBox) {
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Afficher la diapositive ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsBox.appendChild(dot);
  });
  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    [...dotsBox.children].forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    restartTimer();
  }
  function restartTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(currentSlide + 1), 5500);
  }
  document.getElementById('prevSlide')?.addEventListener('click', () => showSlide(currentSlide - 1));
  document.getElementById('nextSlide')?.addEventListener('click', () => showSlide(currentSlide + 1));
  showSlide(0);
}
 
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle?.addEventListener('click', () => mainNav?.classList.toggle('open'));
mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mainNav.classList.remove('open')));
 
// Les noms ci-dessous correspondent aux fichiers visibles dans le dossier image.
const portfolioItems = [
  {name:'Affiche Concert Gospel.jpeg', label:'Affiche Concert Gospel', category:'affiche'},
  ...Array.from({length:8}, (_,i)=>({name:`affiche mariage${i+1}.jpeg`,label:`Affiche mariage ${i+1}`,category:'affiche'})),
  ...Array.from({length:14}, (_,i)=>({name:`Birthday${i+1}.jpeg`,label:`Affiche anniversaire ${i+1}`,category:'affiche'})),
  ...[1,...Array.from({length:30},(_,i)=>i+2)].map(i=>({name:`flyer eglise${i}.jpeg`,label:`Flyer église ${i}`,category:'flyer'})),
  {name:'flyer eglise11.png',label:'Flyer église 11',category:'flyer'},
  {name:'logo bmv,tech.jpg',label:'Logo BMV.TECH',category:'logo'},
  {name:'logo realiser2.png',label:'Logo réalisé',category:'logo'},
  {name:'logo realiser3.jpg',label:'Logo réalisé',category:'logo'},
  ...Array.from({length:7},(_,i)=>({name:`portrait${i+1}.jpg`,label:`Portrait artistique ${i+1}`,category:'portrait'}))
];
const portfolioGrid = document.getElementById('portfolioGrid');
const imagePath = name => `image/${encodeURIComponent(name).replaceAll('%2F','/')}`;
if (portfolioGrid) {
  portfolioItems.forEach((item) => {
    const figure = document.createElement('figure');
    figure.dataset.category = item.category;
    const img = document.createElement('img');
    const candidates = [item.name];
    // Certains fichiers du dossier image utilisent .jpg/.jpeg ou un espace avant le numéro.
    if (item.name.endsWith('.jpeg')) candidates.push(item.name.replace(/\.jpeg$/i,'.jpg'));
    if (item.name.endsWith('.jpg')) candidates.push(item.name.replace(/\.jpg$/i,'.jpeg'));
    const spaced = item.name.replace(/(mariage|eglise)(\d+)/i,'$1 $2');
    const compact = item.name.replace(/(mariage|eglise) (\d+)/i,'$1$2');
    if (spaced !== item.name) candidates.push(spaced);
    if (compact !== item.name) candidates.push(compact);
    let candidateIndex = 0;
    img.src = imagePath(candidates[candidateIndex]);
    img.alt = item.label;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      candidateIndex += 1;
      if (candidateIndex < candidates.length) img.src = imagePath(candidates[candidateIndex]);
      else figure.remove();
    });
    const caption = document.createElement('figcaption');
    caption.textContent = item.label;
    figure.append(img, caption);
    figure.addEventListener('click', () => openLightbox(img.src, item.label));
    portfolioGrid.appendChild(figure);
  });
}
 
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter.active')?.classList.remove('active');
    button.classList.add('active');
    const category = button.dataset.filter;
    document.querySelectorAll('.portfolio-grid figure').forEach(item => {
      item.hidden = category !== 'all' && item.dataset.category !== category;
    });
  });
});
 
// Visionneuse plein écran pour les flyers, affiches, logos et portraits.
const lightbox = document.getElementById('imageLightbox');
function openLightbox(src, caption) {
  if (!lightbox) return;
  lightbox.querySelector('img').src = src;
  lightbox.querySelector('img').alt = caption;
  lightbox.querySelector('.lightbox-caption').textContent = caption;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('no-scroll');
}
function closeLightbox() {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden','true');
  document.body.classList.remove('no-scroll');
}
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
document.querySelectorAll('.personal-grid img').forEach(img => img.addEventListener('click', () => openLightbox(img.src, img.alt)));
 
// VIDEOS : déposer les fichiers MP4 dans /video puis inscrire leurs noms exacts ici.
// Exemple : { file: 'formation-word.mp4', title: 'Initiation à Word' }
const videos = [
  {file:'video1.mp4', title:'Présentation BMV.TECH'},
  {file:'video2.mp4', title:'Initiation à l’informatique'},
  {file:'video3.mp4', title:'Formation bureautique'}
];
const videoGrid = document.getElementById('videoGrid');
if (videoGrid) {
  videos.forEach(video => {
    const card = document.createElement('article');
    card.className = 'video-card';
    const player = document.createElement('video');
    player.controls = true;
    player.preload = 'metadata';
    player.playsInline = true;
    player.src = `video/${encodeURIComponent(video.file)}`;
    const title = document.createElement('h3');
    title.textContent = video.title;
    const missing = document.createElement('p');
    missing.className = 'video-missing';
    missing.textContent = `Ajoute le fichier « ${video.file} » dans le dossier video pour afficher cette vidéo.`;
    player.addEventListener('error', () => { player.hidden = true; missing.hidden = false; });
    missing.hidden = true;
    card.append(player, title, missing);
    videoGrid.appendChild(card);
  });
  if (!videos.length) videoGrid.innerHTML = '<p class="video-empty">Les vidéos seront affichées ici.</p>';
}
 
document.getElementById('year').textContent = new Date().getFullYear();
