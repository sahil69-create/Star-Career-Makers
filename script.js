const firebaseConfig={
  apiKey:"REPLACE",
  authDomain:"REPLACE.firebaseapp.com",
  projectId:"REPLACE",
  storageBucket:"REPLACE.appspot.com",
  messagingSenderId:"REPLACE",
  appId:"REPLACE"
};

firebase.initializeApp(firebaseConfig);
const storage=firebase.storage();
const db=firebase.firestore();

const navToggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('.nav');
if(navToggle){navToggle.addEventListener('click',()=>{const expanded=navToggle.getAttribute('aria-expanded')==='true';navToggle.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open')})}

const animated=document.querySelectorAll('[data-animate]');
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}})},{threshold:.2});
animated.forEach(el=>io.observe(el));

const jobs=[
{title:'Telecaller',salary:'12000-18000',location:'Hisar',category:'Telecaller',experience:'Fresher'},
{title:'Computer Operator',salary:'15000-25000',location:'Hisar',category:'Computer Operator',experience:'0-1 years'},
{title:'Back Office Executive',salary:'14000-22000',location:'Rohtak',category:'Back Office Executive',experience:'0-1 years'},
{title:'HR Assistant',salary:'15000-20000',location:'Gurugram',category:'HR Assistant',experience:'1-3 years'},
{title:'Telecaller',salary:'12000-18000',location:'Remote',category:'Telecaller',experience:'Fresher'}
];
const jobList=document.getElementById('jobList');
function renderJobs(data){if(!jobList)return;jobList.innerHTML='';data.forEach(j=>{const card=document.createElement('article');card.className='card job-card';card.innerHTML=`<div class="title">${j.title}</div><div class="salary">Salary ${j.salary}</div><div class="meta"><span>${j.location}</span><span>${j.category}</span><span>${j.experience}</span></div><div class="actions"><a class="btn btn-outline" href="#contact">Apply Now</a></div>`;jobList.appendChild(card)})}
renderJobs(jobs);
const filterLocation=document.getElementById('filterLocation');
const filterSalary=document.getElementById('filterSalary');
const filterCategory=document.getElementById('filterCategory');
const filterExperience=document.getElementById('filterExperience');
function applyFilters(){const fLoc=filterLocation?filterLocation.value:'';const fSal=filterSalary?filterSalary.value:'';const fCat=filterCategory?filterCategory.value:'';const fExp=filterExperience?filterExperience.value:'';const filtered=jobs.filter(j=>{const a=!fLoc||j.location===fLoc;const b=!fSal||j.salary===fSal;const c=!fCat||j.category===fCat;const d=!fExp||j.experience===fExp;return a&&b&&c&&d});renderJobs(filtered)}
[filterLocation,filterSalary,filterCategory,filterExperience].forEach(el=>{if(el)el.addEventListener('change',applyFilters)});

const track=document.querySelector('.carousel-track');
if(track){const slides=Array.from(track.children);let index=0;function updateCarousel(){if(!slides.length)return;const w=slides[0].getBoundingClientRect().width+20;track.style.transform=`translateX(-${index*w}px)`}function nextSlide(){index=(index+1)%slides.length;updateCarousel()}function prevSlide(){index=(index-1+slides.length)%slides.length;updateCarousel()}const nextBtn=document.querySelector('.carousel-next');const prevBtn=document.querySelector('.carousel-prev');if(nextBtn)nextBtn.addEventListener('click',nextSlide);if(prevBtn)prevBtn.addEventListener('click',prevSlide);setInterval(nextSlide,4000)}

const contactForm=document.getElementById('contactForm');
if(contactForm){contactForm.addEventListener('submit',async e=>{e.preventDefault();
  const name=document.getElementById('name').value.trim();
  const phone=document.getElementById('phone').value.trim();
  const email=document.getElementById('email').value.trim();
  const message=document.getElementById('message').value.trim();
  const fileInput=document.getElementById('resume');
  const file=fileInput&&fileInput.files&&fileInput.files[0]?fileInput.files[0]:null;

  if(!name||!phone||!email||!message){alert('Please fill all fields');return}

  let resumeURL='';
  if(file){
    const path=`resumes/${Date.now()}_${file.name}`;
    const ref=storage.ref().child(path);
    await ref.put(file);
    resumeURL=await ref.getDownloadURL();
  }

  await db.collection('applications').add({
    timestamp:Date.now(),
    name,phone,email,message,
    resumeURL
  });

  alert('Thank you! Your message has been recorded.');
  contactForm.reset();
})}
