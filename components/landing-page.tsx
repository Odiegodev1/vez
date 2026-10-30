export  function LandingPage() {
  return (
<div id="topo" style={{background: "var(--color-nevoa)", color: "var(--color-grafite)", fontFamily: "var(--font-sans)", fontSize: "16px", lineHeight: 1.5}}>
<header style={{maxWidth: "1200px", margin: "0 auto", padding: "22px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap"}}>
<a href="#topo" aria-label="Vez, início" style={{display: "flex", alignItems: "center", gap: "10px"}}>
<span style={{width: "36px", height: "36px", borderRadius: "11px", background: "var(--color-grafite)", color: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "22px"}}>v</span>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "28px", letterSpacing: "-0.03em"}}>vez</span>
</a>
<nav aria-label="Principal" style={{display: "flex", gap: "28px", flexWrap: "wrap", fontWeight: 600, fontSize: "15px", color: "var(--color-cinzaapoio)"}}>
<a href="#para-quem">Para quem</a>
<a href="#como-funciona">Como funciona</a>
<a href="#painel">Painel</a>
<a href="#planos">Planos</a>
<a href="#duvidas">Dúvidas</a>
</nav>
<div style={{display: "flex", gap: "10px", alignItems: "center"}}>
<a href="#topo" style={{display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 18px", borderRadius: "999px", fontWeight: 600, fontSize: "15px"}}>Entrar</a>
<a href="#criar" style={{display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 22px", borderRadius: "999px", background: "var(--color-grafite)", color: "var(--color-nevoa)", fontWeight: 700, fontSize: "15px"}}>Testar grátis</a>
</div>
</header>
<section style={{maxWidth: "1200px", margin: "0 auto", padding: "32px 32px 88px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "48px"}}>
<div style={{flex: "1 1 480px", minWidth: "0", display: "flex", flexDirection: "column", gap: "28px"}}>
<div style={{alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 12px", borderRadius: "999px", background: "#fff", border: "1px solid var(--color-borda)", fontSize: "14px", fontWeight: 600, color: "var(--color-grafite)"}}>
<span style={{width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-lima)", boxShadow: "0 0 0 3px var(--color-grafite)"}}></span>
Fila de espera para barbearias, unhas e cílios
</div>
<h1 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "clamp(44px,7vw,84px)", lineHeight: 0.98, letterSpacing: "-0.04em"}}>Acabou a fila<br />na <span style={{background: "var(--color-lima)", padding: "0 0.12em", borderRadius: "0.16em"}}>porta.</span></h1>
<p style={{margin: "0", maxWidth: "520px", fontSize: "20px", lineHeight: 1.5, color: "var(--color-cinzaapoio)"}}>O cliente entra na fila pelo celular, acompanha a vez em tempo real e chega na hora certa. Você atende sem lista de papel e sem responder “quanto falta?” no WhatsApp.</p>
<div style={{display: "flex", flexWrap: "wrap", gap: "12px"}}>
<a href="#criar" style={{display: "inline-flex", alignItems: "center", gap: "10px", minHeight: "56px", padding: "0 28px", borderRadius: "999px", background: "var(--color-lima)", color: "var(--color-grafite)", fontWeight: 700, fontSize: "17px", boxShadow: "0 0 0 2px var(--color-grafite)"}}>
Criar minha fila grátis
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
</a>
<a href="#como-funciona" style={{display: "inline-flex", alignItems: "center", minHeight: "56px", padding: "0 26px", borderRadius: "999px", border: "1.5px solid var(--color-grafite)", fontWeight: 700, fontSize: "17px"}}>Ver como funciona</a>
</div>
<ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexWrap: "wrap", gap: "12px 24px", fontSize: "15px", fontWeight: 500, color: "var(--color-cinzaapoio)"}}>
<li style={{display: "flex", alignItems: "center", gap: "8px"}}><span style={{width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", color: "var(--color-grafite)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Cliente não baixa nenhum app</li>
<li style={{display: "flex", alignItems: "center", gap: "8px"}}><span style={{width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", color: "var(--color-grafite)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Aviso automático por WhatsApp</li>
<li style={{display: "flex", alignItems: "center", gap: "8px"}}><span style={{width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", color: "var(--color-grafite)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Funciona no celular, tablet ou PC</li>
</ul>
</div>
<div style={{flex: "1 1 360px", minWidth: "0", display: "flex", justifyContent: "center"}}>
<div style={{position: "relative", width: "320px", height: "640px"}}>
<div style={{position: "absolute", left: "20px", top: "0", width: "280px", height: "600px", borderRadius: "48px", background: "var(--color-grafite)", padding: "10px", boxSizing: "border-box", boxShadow: "0 40px 70px -24px rgba(17,20,18,0.45)"}}>
<div style={{width: "100%", height: "100%", borderRadius: "38px", background: "var(--color-nevoa)", boxSizing: "border-box", padding: "24px 14px 14px", display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px"}}>
<div style={{display: "flex", alignItems: "center", gap: "8px", minWidth: "0"}}>
<span style={{width: "26px", height: "26px", borderRadius: "8px", background: "var(--color-grafite)", color: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "15px"}}>N</span>
<span style={{fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap"}}>Navalha Barbearia</span>
</div>
<span style={{display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 9px", borderRadius: "999px", background: "var(--color-grafite)", color: "var(--color-lima)", fontSize: "10px", fontWeight: 700}}><span style={{width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-lima)"}}></span>Ao vivo</span>
</div>
<div style={{background: "var(--color-grafite)", borderRadius: "24px", overflow: "hidden"}}>
<div style={{padding: "18px 18px 14px"}}>
<div style={{fontSize: "10px", letterSpacing: "0.14em", fontWeight: 700, color: "var(--color-cinzaapoio)"}}>SUA SENHA</div>
<div style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "72px", lineHeight: 1, letterSpacing: "-0.04em", color: "var(--color-lima)"}}>B-07</div>
<div style={{fontSize: "12px", color: "#fff9", marginTop: "4px"}}>Matheus · Corte + barba</div>
</div>
<div style={{position: "relative", margin: "0 18px", borderTop: "2px dashed var(--color-cinzaapoio)"}}>
<span style={{position: "absolute", left: "-28px", top: "-11px", width: "20px", height: "20px", borderRadius: "50%", background: "var(--color-nevoa)"}}></span>
<span style={{position: "absolute", right: "-28px", top: "-11px", width: "20px", height: "20px", borderRadius: "50%", background: "var(--color-nevoa)"}}></span>
</div>
<div style={{display: "flex", gap: "12px", padding: "14px 18px 16px"}}>
<div style={{flex: "1"}}>
<div style={{fontSize: "10px", color: "var(--color-cinzaapoio)", fontWeight: 600}}>Na sua frente</div>
<div style={{fontSize: "16px", fontWeight: 700, color: "#fff"}}>2 pessoas</div>
</div>
<div style={{flex: "1"}}>
<div style={{fontSize: "10px", color: "var(--color-cinzaapoio)", fontWeight: 600}}>Espera estimada</div>
<div style={{fontSize: "16px", fontWeight: 700, color: "#fff"}}>~20 min</div>
</div>
</div>
</div>
<div style={{background: "var(--color-branco)", border: "1px solid var(--color-borda)", borderRadius: "20px", padding: "6px", display: "flex", flexDirection: "column", gap: "2px"}}>
<div style={{display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px"}}>
<span style={{width: "28px", height: "28px", borderRadius: "50%", background: "var(--color-azul-suave)", color: "var(--color-azulstatus)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700}}>LA</span>
<span style={{flex: "1", fontSize: "12px", fontWeight: 600}}>B-05 · Lucas</span>
<span style={{fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: "var(--color-azul-suave)", color: "var(--color-azulstatus)"}}>Atendendo</span>
</div>
<div style={{display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px"}}>
<span style={{width: "28px", height: "28px", borderRadius: "50%", background: "var(--color-neutro-suave)", color: "var(--color-cinzaapoio)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700}}>PH</span>
<span style={{flex: "1", fontSize: "12px", fontWeight: 600}}>B-06 · Pedro</span>
<span style={{fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: "var(--color-neutro-suave)", color: "var(--color-cinzaapoio)"}}>Aguardando</span>
</div>
<div style={{display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "14px", background: "var(--color-lima-suave)"}}>
<span style={{width: "28px", height: "28px", borderRadius: "50%", background: "var(--color-lima)", color: "var(--color-grafite)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700}}>VC</span>
<span style={{flex: "1", fontSize: "12px", fontWeight: 700}}>B-07 · Você</span>
<span style={{fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: "var(--color-grafite)", color: "var(--color-lima)"}}>Na fila</span>
</div>
</div>
</div>
</div>
<div style={{position: "absolute", left: "0", bottom: "36px", width: "210px", background: "var(--color-branco)", borderRadius: "20px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 24px 40px -16px rgba(17,20,18,0.35)", transform: "rotate(-3deg)"}}>
<span style={{flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-lima)", color: "var(--color-grafite)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg></span>
<div>
<div style={{fontSize: "14px", fontWeight: 700, lineHeight: 1.25}}>Falta pouco!</div>
<div style={{fontSize: "12px", color: "var(--color-cinzaapoio)", lineHeight: 1.3}}>Sua vez em ~10 min</div>
</div>
</div>
<div style={{position: "absolute", right: "0", top: "92px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 14px", borderRadius: "999px", background: "var(--color-lima)", color: "var(--color-grafite)", fontSize: "12px", fontWeight: 700, boxShadow: "0 0 0 2px var(--color-grafite)", transform: "rotate(4deg)"}}>
<span style={{width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-grafite)"}}></span>Chamando · Cadeira 2
</div>
</div>
</div>
</section>
<section id="para-quem" style={{maxWidth: "1200px", margin: "0 auto", padding: "72px 32px 88px", display: "flex", flexDirection: "column", gap: "44px"}}>
<div style={{display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px"}}>
<div style={{display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", color: "#3E5200"}}><span style={{width: "28px", height: "3px", borderRadius: "2px", background: "var(--color-lima)", boxShadow: "0 0 0 1px var(--color-grafite)"}}></span>PARA QUEM</div>
<h2 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "clamp(34px,4.6vw,56px)", lineHeight: 1.02, letterSpacing: "-0.03em"}}>Feito para o balcão de quem atende.</h2>
<p style={{margin: "0", fontSize: "18px", color: "var(--color-cinzaapoio)"}}>Uma fila, três jeitos de trabalhar. Cada tipo de negócio com seus serviços, seus tempos e sua letra de senha.</p>
</div>
<div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px"}}>
<article style={{background: "var(--color-branco)", border: "1px solid var(--color-borda)", borderRadius: "28px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
<span style={{width: "56px", height: "56px", borderRadius: "18px", background: "var(--color-grafite)", color: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M20 4 8.12 15.88"></path><path d="M14.47 14.48 20 20"></path><path d="M8.12 8.12 12 12"></path></svg></span>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "20px", padding: "6px 14px", borderRadius: "10px", background: "var(--color-lima)"}}>B-12</span>
</div>
<h3 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "28px", letterSpacing: "-0.02em"}}>Barbearias</h3>
<p style={{margin: "0", fontSize: "16px", color: "var(--color-cinzaapoio)"}}>Corte, barba, sobrancelha. Fila geral ou por barbeiro, com o tempo médio de cada serviço já calculado.</p>
<div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "auto"}}>
<span style={{padding: "6px 12px", borderRadius: "999px", background: "var(--color-neutro-suave)", fontSize: "13px", fontWeight: 600}}>Fila por barbeiro</span>
<span style={{padding: "6px 12px", borderRadius: "999px", background: "var(--color-neutro-suave)", fontSize: "13px", fontWeight: 600}}>Sem hora marcada</span>
</div>
</article>
<article style={{background: "var(--color-branco)", border: "1px solid var(--color-borda)", borderRadius: "28px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
<span style={{width: "56px", height: "56px", borderRadius: "18px", background: "var(--color-grafite)", color: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"></path><path d="M19 17v4"></path><path d="M17 19h4"></path></svg></span>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "20px", padding: "6px 14px", borderRadius: "10px", background: "var(--color-lima)"}}>N-04</span>
</div>
<h3 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "28px", letterSpacing: "-0.02em"}}>Unhas</h3>
<p style={{margin: "0", fontSize: "16px", color: "var(--color-cinzaapoio)"}}>Manicure, pedicure, alongamento. Defina a duração de cada técnica e ninguém fica esperando de pé.</p>
<div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "auto"}}>
<span style={{padding: "6px 12px", borderRadius: "999px", background: "var(--color-neutro-suave)", fontSize: "13px", fontWeight: 600}}>Duração por técnica</span>
<span style={{padding: "6px 12px", borderRadius: "999px", background: "var(--color-neutro-suave)", fontSize: "13px", fontWeight: 600}}>Encaixes</span>
</div>
</article>
<article style={{background: "var(--color-branco)", border: "1px solid var(--color-borda)", borderRadius: "28px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
<span style={{width: "56px", height: "56px", borderRadius: "18px", background: "var(--color-grafite)", color: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg></span>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "20px", padding: "6px 14px", borderRadius: "10px", background: "var(--color-lima)"}}>L-03</span>
</div>
<h3 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "28px", letterSpacing: "-0.02em"}}>Cílios</h3>
<p style={{margin: "0", fontSize: "16px", color: "var(--color-cinzaapoio)"}}>Extensão, lifting, manutenção. Serviços longos pedem previsão certa: a Vez calcula e avisa na hora.</p>
<div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "auto"}}>
<span style={{padding: "6px 12px", borderRadius: "999px", background: "var(--color-neutro-suave)", fontSize: "13px", fontWeight: 600}}>Serviços longos</span>
<span style={{padding: "6px 12px", borderRadius: "999px", background: "var(--color-neutro-suave)", fontSize: "13px", fontWeight: 600}}>Previsão de espera</span>
</div>
</article>
</div>
</section>
<section id="como-funciona" style={{margin: "0 16px"}}>
<div style={{maxWidth: "1200px", margin: "0 auto", background: "var(--color-grafite)", color: "var(--color-nevoa)", borderRadius: "40px", padding: "72px 56px", display: "flex", flexDirection: "column", gap: "48px", boxSizing: "border-box"}}>
<div style={{display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px"}}>
<div style={{display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", color: "var(--color-lima)"}}><span style={{width: "28px", height: "3px", borderRadius: "2px", background: "var(--color-lima)"}}></span>COMO FUNCIONA</div>
<h2 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "clamp(34px,4.6vw,56px)", lineHeight: 1.02, letterSpacing: "-0.03em"}}>Três passos. Zero sala de espera lotada.</h2>
</div>
<div style={{display: "flex", flexWrap: "wrap", gap: "40px 32px"}}>
<div style={{flex: "1 1 260px", borderTop: "1px solid var(--color-divisor)", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "14px"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "72px", lineHeight: 1, color: "var(--color-lima)", letterSpacing: "-0.04em"}}>01</span>
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><path d="M14 14h3v3h-3z"></path><path d="M20 14v.01"></path><path d="M14 20h.01"></path><path d="M20 20h.01"></path></svg>
</div>
<h3 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "26px", letterSpacing: "-0.02em"}}>Escaneie o QR do balcão</h3>
<p style={{margin: "0", fontSize: "16px", color: "#C3CAC5"}}>O cliente aponta a câmera e abre a sua fila no navegador. Sem cadastro longo, sem app.</p>
</div>
<div style={{flex: "1 1 260px", borderTop: "1px solid var(--color-divisor)", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "14px"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "72px", lineHeight: 1, color: "var(--color-lima)", letterSpacing: "-0.04em"}}>02</span>
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
</div>
<h3 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "26px", letterSpacing: "-0.02em"}}>Escolha o serviço e entre</h3>
<p style={{margin: "0", fontSize: "16px", color: "#C3CAC5"}}>Nome, WhatsApp e serviço. A Vez mostra a posição e quanto tempo falta, na hora.</p>
</div>
<div style={{flex: "1 1 260px", borderTop: "1px solid var(--color-divisor)", paddingTop: "28px", display: "flex", flexDirection: "column", gap: "14px"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "72px", lineHeight: 1, color: "var(--color-lima)", letterSpacing: "-0.04em"}}>03</span>
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
</div>
<h3 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "26px", letterSpacing: "-0.02em"}}>Receba o aviso e chegue</h3>
<p style={{margin: "0", fontSize: "16px", color: "#C3CAC5"}}>Quando a vez se aproxima, o cliente é avisado por WhatsApp. Ele espera onde quiser.</p>
</div>
</div>
</div>
</section>
<section id="painel" style={{maxWidth: "1200px", margin: "0 auto", padding: "96px 32px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "56px"}}>
<div style={{flex: "1 1 380px", minWidth: "0", display: "flex", flexDirection: "column", gap: "24px"}}>
<div style={{display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", color: "#3E5200"}}><span style={{width: "28px", height: "3px", borderRadius: "2px", background: "var(--color-lima)", boxShadow: "0 0 0 1px var(--color-grafite)"}}></span>PAINEL</div>
<h2 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "clamp(34px,4.6vw,56px)", lineHeight: 1.02, letterSpacing: "-0.03em"}}>Seu painel, sem treinamento.</h2>
<p style={{margin: "0", fontSize: "18px", color: "var(--color-cinzaapoio)"}}>Quem atende vê a fila, chama o próximo e segue o trabalho. Tudo cabe em uma tela.</p>
<ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "14px", fontSize: "17px", fontWeight: 600}}>
<li style={{display: "flex", alignItems: "center", gap: "12px"}}><span style={{flex: "0 0 28px", width: "28px", height: "28px", borderRadius: "50%", background: "var(--color-grafite)", color: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Chame o próximo com um toque</li>
<li style={{display: "flex", alignItems: "center", gap: "12px"}}><span style={{flex: "0 0 28px", width: "28px", height: "28px", borderRadius: "50%", background: "var(--color-grafite)", color: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Pause a fila na hora do almoço</li>
<li style={{display: "flex", alignItems: "center", gap: "12px"}}><span style={{flex: "0 0 28px", width: "28px", height: "28px", borderRadius: "50%", background: "var(--color-grafite)", color: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Veja quem está esperando há mais tempo</li>
<li style={{display: "flex", alignItems: "center", gap: "12px"}}><span style={{flex: "0 0 28px", width: "28px", height: "28px", borderRadius: "50%", background: "var(--color-grafite)", color: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Telão para a sala de espera</li>
</ul>
</div>
<div style={{flex: "1.2 1 440px", minWidth: "0", background: "var(--color-branco)", border: "1px solid var(--color-borda)", borderRadius: "32px", padding: "24px", boxShadow: "0 30px 60px -30px rgba(17,20,18,0.25)", display: "flex", flexDirection: "column", gap: "16px"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap"}}>
<div style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.02em"}}>Fila de hoje</div>
<span style={{padding: "6px 14px", borderRadius: "999px", background: "var(--color-grafite)", color: "var(--color-lima)", fontSize: "13px", fontWeight: 700}}>6 na fila</span>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
<div style={{display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "20px", background: "var(--color-lima)", flexWrap: "wrap"}}>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "24px", minWidth: "68px"}}>B-05</span>
<div style={{flex: "1 1 120px"}}><div style={{fontWeight: 700, fontSize: "15px"}}>Lucas Andrade</div><div style={{fontSize: "13px", color: "var(--color-cinzaapoio)"}}>Corte · chamando</div></div>
<span style={{display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 18px", borderRadius: "999px", background: "var(--color-grafite)", color: "var(--color-nevoa)", fontSize: "14px", fontWeight: 700}}>Atender</span>
</div>
<div style={{display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "20px", background: "var(--color-nevoa)", flexWrap: "wrap"}}>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "24px", minWidth: "68px"}}>B-06</span>
<div style={{flex: "1 1 120px"}}><div style={{fontWeight: 700, fontSize: "15px"}}>Pedro Henrique</div><div style={{fontSize: "13px", color: "var(--color-cinzaapoio)"}}>Barba · 14 min de espera</div></div>
<span style={{display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 18px", borderRadius: "999px", border: "1.5px solid var(--color-grafite)", fontSize: "14px", fontWeight: 700}}>Chamar</span>
</div>
<div style={{display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "20px", background: "var(--color-nevoa)", flexWrap: "wrap"}}>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "24px", minWidth: "68px"}}>B-07</span>
<div style={{flex: "1 1 120px"}}><div style={{fontWeight: 700, fontSize: "15px"}}>Matheus Souza</div><div style={{fontSize: "13px", color: "var(--color-cinzaapoio)"}}>Corte + barba · 9 min de espera</div></div>
<span style={{display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 18px", borderRadius: "999px", border: "1.5px solid var(--color-grafite)", fontSize: "14px", fontWeight: 700}}>Chamar</span>
</div>
<div style={{display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "20px", background: "var(--color-nevoa)", flexWrap: "wrap"}}>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "24px", minWidth: "68px"}}>B-08</span>
<div style={{flex: "1 1 120px"}}><div style={{fontWeight: 700, fontSize: "15px"}}>João Vítor</div><div style={{fontSize: "13px", color: "var(--color-cinzaapoio)"}}>Sobrancelha · 6 min de espera</div></div>
<span style={{display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 18px", borderRadius: "999px", border: "1.5px solid var(--color-grafite)", fontSize: "14px", fontWeight: 700}}>Chamar</span>
</div>
</div>
</div>
</section>
<section id="planos" style={{maxWidth: "1200px", margin: "0 auto", padding: "40px 32px 96px", display: "flex", flexDirection: "column", gap: "44px"}}>
<div style={{display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px"}}>
<div style={{display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", color: "#3E5200"}}><span style={{width: "28px", height: "3px", borderRadius: "2px", background: "var(--color-lima)", boxShadow: "0 0 0 1px var(--color-grafite)"}}></span>PLANOS</div>
<h2 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "clamp(34px,4.6vw,56px)", lineHeight: 1.02, letterSpacing: "-0.03em"}}>Cresce junto com o seu movimento.</h2>
</div>
<div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px", alignItems: "stretch"}}>
<article style={{background: "var(--color-branco)", border: "1px solid var(--color-borda)", borderRadius: "32px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px"}}>
<div>
<h3 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "26px", letterSpacing: "-0.02em"}}>Começo</h3>
<p style={{margin: "4px 0 0", fontSize: "15px", color: "var(--color-cinzaapoio)"}}>Para quem atende sozinho.</p>
</div>
<div style={{display: "flex", alignItems: "baseline", gap: "6px"}}><span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "52px", lineHeight: 1, letterSpacing: "-0.04em"}}>R$ [00]</span><span style={{fontSize: "15px", color: "var(--color-cinzaapoio)"}}>/mês</span></div>
<ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", fontWeight: 500}}>
<li style={{display: "flex", gap: "10px", alignItems: "center"}}><span style={{flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>1 profissional</li>
<li style={{display: "flex", gap: "10px", alignItems: "center"}}><span style={{flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>QR code e link da fila</li>
<li style={{display: "flex", gap: "10px", alignItems: "center"}}><span style={{flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Aviso por WhatsApp (até [N] por mês)</li>
</ul>
<a href="#criar" style={{marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "52px", borderRadius: "999px", border: "1.5px solid var(--color-grafite)", fontWeight: 700, fontSize: "16px"}}>Começar</a>
</article>
<article style={{background: "var(--color-grafite)", color: "var(--color-nevoa)", borderRadius: "32px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 30px 60px -30px rgba(17,20,18,0.5)"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px"}}>
<div>
<h3 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "26px", letterSpacing: "-0.02em"}}>Profissional</h3>
<p style={{margin: "4px 0 0", fontSize: "15px", color: "#C3CAC5"}}>Para equipes pequenas.</p>
</div>
<span style={{padding: "6px 12px", borderRadius: "999px", background: "var(--color-lima)", color: "var(--color-grafite)", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap"}}>Mais escolhido</span>
</div>
<div style={{display: "flex", alignItems: "baseline", gap: "6px"}}><span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "52px", lineHeight: 1, letterSpacing: "-0.04em", color: "var(--color-lima)"}}>R$ [00]</span><span style={{fontSize: "15px", color: "#C3CAC5"}}>/mês</span></div>
<ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", fontWeight: 500}}>
<li style={{display: "flex", gap: "10px", alignItems: "center"}}><span style={{flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Até [N] profissionais</li>
<li style={{display: "flex", gap: "10px", alignItems: "center"}}><span style={{flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Telão para a sala de espera</li>
<li style={{display: "flex", gap: "10px", alignItems: "center"}}><span style={{flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Relatórios de atendimento</li>
</ul>
<a href="#criar" style={{marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "52px", borderRadius: "999px", background: "var(--color-lima)", color: "var(--color-grafite)", fontWeight: 700, fontSize: "16px"}}>Testar grátis</a>
</article>
<article style={{background: "var(--color-branco)", border: "1px solid var(--color-borda)", borderRadius: "32px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px"}}>
<div>
<h3 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "26px", letterSpacing: "-0.02em"}}>Salão</h3>
<p style={{margin: "4px 0 0", fontSize: "15px", color: "var(--color-cinzaapoio)"}}>Para equipes e várias unidades.</p>
</div>
<div style={{display: "flex", alignItems: "baseline", gap: "6px"}}><span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "52px", lineHeight: 1, letterSpacing: "-0.04em"}}>R$ [00]</span><span style={{fontSize: "15px", color: "var(--color-cinzaapoio)"}}>/mês</span></div>
<ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", fontWeight: 500}}>
<li style={{display: "flex", gap: "10px", alignItems: "center"}}><span style={{flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Profissionais ilimitados</li>
<li style={{display: "flex", gap: "10px", alignItems: "center"}}><span style={{flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Várias unidades</li>
<li style={{display: "flex", gap: "10px", alignItems: "center"}}><span style={{flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg></span>Suporte prioritário</li>
</ul>
<a href="#criar" style={{marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "52px", borderRadius: "999px", border: "1.5px solid var(--color-grafite)", fontWeight: 700, fontSize: "16px"}}>Falar com a equipe</a>
</article>
</div>
</section>
<section id="duvidas" style={{maxWidth: "1200px", margin: "0 auto", padding: "0 32px 96px", display: "flex", flexWrap: "wrap", gap: "40px 64px"}}>
<div style={{flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "16px"}}>
<div style={{display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", color: "#3E5200"}}><span style={{width: "28px", height: "3px", borderRadius: "2px", background: "var(--color-lima)", boxShadow: "0 0 0 1px var(--color-grafite)"}}></span>DÚVIDAS</div>
<h2 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "clamp(34px,4.6vw,56px)", lineHeight: 1.02, letterSpacing: "-0.03em"}}>Perguntas comuns.</h2>
</div>
<div style={{flex: "2 1 460px", display: "flex", flexDirection: "column"}}>
<div style={{padding: "24px 0", borderTop: "1px solid var(--color-borda)", display: "flex", flexDirection: "column", gap: "8px"}}>
<h3 style={{margin: "0", fontSize: "19px", fontWeight: 700}}>O cliente precisa baixar um app?</h3>
<p style={{margin: "0", fontSize: "16px", color: "var(--color-cinzaapoio)"}}>Não. Ele escaneia o QR code ou abre o link e entra na fila direto pelo navegador do celular.</p>
</div>
<div style={{padding: "24px 0", borderTop: "1px solid var(--color-borda)", display: "flex", flexDirection: "column", gap: "8px"}}>
<h3 style={{margin: "0", fontSize: "19px", fontWeight: 700}}>Como o cliente é avisado?</h3>
<p style={{margin: "0", fontSize: "16px", color: "var(--color-cinzaapoio)"}}>Por WhatsApp e pela tela de acompanhamento, que atualiza sozinha quando a fila anda.</p>
</div>
<div style={{padding: "24px 0", borderTop: "1px solid var(--color-borda)", display: "flex", flexDirection: "column", gap: "8px"}}>
<h3 style={{margin: "0", fontSize: "19px", fontWeight: 700}}>Funciona para atendimento sem hora marcada?</h3>
<p style={{margin: "0", fontSize: "16px", color: "var(--color-cinzaapoio)"}}>Sim. A Vez foi pensada para ordem de chegada e também organiza quem já tem horário.</p>
</div>
<div style={{padding: "24px 0", borderTop: "1px solid var(--color-borda)", borderBottom: "1px solid var(--color-borda)", display: "flex", flexDirection: "column", gap: "8px"}}>
<h3 style={{margin: "0", fontSize: "19px", fontWeight: 700}}>Posso ter uma fila por profissional?</h3>
<p style={{margin: "0", fontSize: "16px", color: "var(--color-cinzaapoio)"}}>Pode. Cada profissional tem a sua fila e o cliente escolhe com quem quer ser atendido ou entra na fila geral.</p>
</div>
</div>
</section>
<section id="criar" style={{margin: "0 16px 16px"}}>
<div style={{maxWidth: "1200px", margin: "0 auto", background: "var(--color-lima)", borderRadius: "40px", padding: "72px 56px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "40px 56px", boxSizing: "border-box"}}>
<div style={{flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "16px"}}>
<h2 style={{margin: "0", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1, letterSpacing: "-0.035em"}}>Sua próxima fila começa agora.</h2>
<p style={{margin: "0", fontSize: "18px", color: "var(--color-grafite)"}}>Informe seu WhatsApp e a gente te leva para configurar o primeiro QR code.</p>
</div>
<form style={{flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "12px", background: "var(--color-branco)", borderRadius: "28px", padding: "24px"}}>
<label htmlFor="whats" style={{fontSize: "14px", fontWeight: 700}}>Seu WhatsApp</label>
<input id="whats" type="tel" placeholder="(21) 90000-0000" style={{minHeight: "56px", border: "1.5px solid var(--color-borda)", borderRadius: "16px", padding: "0 18px", fontSize: "17px", fontFamily: "var(--font-sans)", background: "var(--color-branco)", color: "var(--color-grafite)", boxSizing: "border-box", width: "100%"}} />
<a href="#topo" style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "56px", borderRadius: "999px", background: "var(--color-grafite)", color: "var(--color-lima)", fontWeight: 700, fontSize: "17px"}}>Criar minha fila grátis
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></a>
</form>
</div>
</section>
<footer style={{maxWidth: "1200px", margin: "0 auto", padding: "40px 32px 48px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px"}}>
<a href="#topo" aria-label="Vez, início" style={{display: "flex", alignItems: "center", gap: "10px"}}>
<span style={{width: "32px", height: "32px", borderRadius: "10px", background: "var(--color-grafite)", color: "var(--color-lima)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "20px"}}>v</span>
<span style={{fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.03em"}}>vez</span>
</a>
<nav aria-label="Rodapé" style={{display: "flex", flexWrap: "wrap", gap: "8px 24px", fontSize: "14px", fontWeight: 600, color: "var(--color-cinzaapoio)"}}>
<a href="#para-quem">Para quem</a>
<a href="#planos">Planos</a>
<a href="#duvidas">Dúvidas</a>
<a href="#topo">Termos de uso</a>
<a href="#topo">Privacidade</a>
</nav>
<div style={{fontSize: "14px", color: "var(--color-cinzaapoio)"}}>© 2026 Vez. Feito para quem atende.</div>
</footer>
</div>
  );
}
