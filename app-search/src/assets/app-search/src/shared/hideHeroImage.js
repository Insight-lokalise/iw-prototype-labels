export const hideHeroImageBanner = () => {
  const heroImage = (document.getElementsByClassName("hero-image-container short-hero-image")?.length) ? document.getElementsByClassName("hero-image-container short-hero-image") ||
    document.getElementsByClassName("hero-image-container short-hero-image") : 
    document.getElementsByClassName("callout-inner")
    
  if(heroImage && heroImage[0]) {
    heroImage[0].style.display = "none";
  }  
}
