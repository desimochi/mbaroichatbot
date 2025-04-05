// public/widget.js
(function () {
    if (window.MBAROIChatbotLoaded) return;
    window.MBAROIChatbotLoaded = true;
  
    const iframe = document.createElement('iframe');
    iframe.src = "https://mbaroi.in/embed"; // ✅ YOUR DOMAIN
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '380px';
    iframe.style.height = '520px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '18px';
    iframe.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)';
    iframe.style.zIndex = '999999';
  
    document.body.appendChild(iframe);
  })();
  