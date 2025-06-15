export default function TawkTo() {
  if (typeof window === "undefined") return null;

  const tawkToScript = document.createElement("script");
  tawkToScript.src = "https://embed.tawk.to/64f0b3c1d5ab8b1d455e2a4f/1h6q7g9qk";
  tawkToScript.async = true;
  tawkToScript.setAttribute("crossorigin", "*");

  document.body.appendChild(tawkToScript);

  (window as any).Tawk_API = (window as any).Tawk_API || {};
  (function () {
    var s1 = document.createElement("script"),
      s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = "https://embed.tawk.to/6849b968aa4c3319118fe6ca/1itfvogin";

    s1.setAttribute("crossorigin", "*");
    if (s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }
  })();
  return null;
}