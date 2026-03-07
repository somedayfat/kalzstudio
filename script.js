const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('on'); });
},{threshold:0.07});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
