export const scrollToSection = (id: string) => {
  const container = document.querySelector('.landing-page') as HTMLElement;
  const target = document.getElementById(id);
  if (!container || !target) return;
  container.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
};
