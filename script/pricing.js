/* pricing.js — corrected: listen to checkbox change only, remove aria-hidden warning */
(function(){
  const DEBUG = true;
  function dbg(...args){ if(DEBUG) console.info('[pricing.js]', ...args); }

  document.addEventListener('DOMContentLoaded', () => {
    dbg('script loaded and DOM ready');

    const billingCheckbox = document.getElementById('billing');
    const toggleLabel = document.querySelector('.switch');
    const pricingGrid = document.getElementById('pricingGrid');

    if(!billingCheckbox) dbg('WARNING: #billing checkbox not found');
    if(!toggleLabel) dbg('WARNING: .switch (label) not found');
    if(!pricingGrid) dbg('WARNING: #pricingGrid not found');

    function updatePrices(isYearly){
      document.querySelectorAll('.price').forEach(el => {
        const monthly = Number(el.getAttribute('data-monthly'));
        const yearly = Number(el.getAttribute('data-yearly'));
        const amountEl = el.querySelector('.amount');
        const periodEl = el.querySelector('.period');
        if(!amountEl || !periodEl) return;

        if(isYearly && Number.isFinite(yearly) && yearly > 0){
          amountEl.textContent = Math.round(yearly / 12);
          periodEl.textContent = '/mo billed yearly';
        } else if(Number.isFinite(monthly)){
          amountEl.textContent = monthly;
          periodEl.textContent = '/mo';
        }
      });

      if(toggleLabel) toggleLabel.setAttribute('aria-checked', isYearly ? 'true' : 'false');
      dbg('Prices updated. yearly=', isYearly);
    }

    // initialize from actual checkbox state
    let yearly = Boolean(billingCheckbox && billingCheckbox.checked);
    updatePrices(yearly);

    // IMPORTANT: only watch the checkbox change event (no manual label click toggling)
    if(billingCheckbox){
      billingCheckbox.addEventListener('change', () => {
        yearly = Boolean(billingCheckbox.checked);
        updatePrices(yearly);
      });
    }

    // Card tilt (respect reduced motion)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!prefersReduced && pricingGrid){
      pricingGrid.querySelectorAll('.pricing-card').forEach(card=>{
        card.addEventListener('mousemove', (ev)=>{
          const rect = card.getBoundingClientRect();
          const x = ev.clientX - rect.left;
          const y = ev.clientY - rect.top;
          const cx = rect.width/2;
          const cy = rect.height/2;
          const dx = (x - cx) / cx;
          const dy = (y - cy) / cy;
          const rx = dy * 6;
          const ry = dx * -6;
          card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
          card.style.boxShadow = '0 34px 80px rgba(11,18,26,0.6)';
        });
        card.addEventListener('mouseleave', ()=>{
          card.style.transform = '';
          card.style.boxShadow = '';
        });
      });
    }

    // Disable CTAs on selection
    function disableCardButtons(card){
      if(!card) return;
      const primary = card.querySelector('.btn.primary');
      const ghost = card.querySelector('.btn.ghost');
      if(primary){
        primary.disabled = true;
        primary.setAttribute('aria-disabled','true');
        primary.classList.add('disabled');
        primary.textContent = 'Selected';
      }
      if(ghost){
        ghost.disabled = true;
        ghost.setAttribute('aria-disabled','true');
        ghost.classList.add('disabled');
      }
      dbg('Disabled buttons for plan:', card.dataset.plan);
    }

    if(pricingGrid){
      pricingGrid.querySelectorAll('.btn.primary').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const card = btn.closest('.pricing-card');
          if(!card) return;
          try{ btn.animate([{transform:'scale(1)'},{transform:'scale(.97)'},{transform:'scale(1)'}],{duration:180}); }catch(err){}
          disableCardButtons(card);
        });
      });
    }

    window.pricingScriptLoaded = true;
    dbg('pricing.js initialized — window.pricingScriptLoaded =', window.pricingScriptLoaded);
  });
})();
