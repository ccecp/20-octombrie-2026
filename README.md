# Proba scrisă · 20 octombrie 2026

40 de teste × 20 de itemi, 60 de minute/test. Fiecare test: 5 Legea nr. 198/2023, 5 ROFUIP, 4 Bush, 2 Hattie, 2 Profilul managerului școlar, 2 Curriculum. Patru variante ordonate alfabetic în limba română, etichete a, b, c, d. 0,5 puncte/item; prag 7.

Răspunsurile, nota și explicațiile apar după finalizare. Include salvare locală, revenire la itemi, grilă de verificare, finalizare automată, filtrarea greșelilor și tipărirea explicațiilor. Fiecare item are un reper bibliografic. Itemii de legislație includ articolul, alineatul când este disponibil și fragmentul exact verificat. Fără itemi repetați între cele 40 de teste.

Materiale de antrenament; nu sunt subiecte oficiale. Surse: materialele de studiu de pe concursdirectori.ro și ccecp.github.io; Legea 198 consolidată din documentul de studiu la 15.09.2026, ROFUIP cu actualizări 2026, Bush cap. 1–3, Hattie cap. 9, Profil OMEC 3934/2026, Curriculum OMEC 4137/2026 cap. 10. Distribuția și notarea: informarea MEC din 29.09.2026.

Pentru rulare locală: `python -m http.server 8000`, apoi deschideți http://localhost:8000. Pentru GitHub Pages: Settings → Pages → Source → GitHub Actions, apoi relansați workflow-ul „Verificare și publicare teste”.

Prof. dr. Maria-Magdalena Dorcioman

## Seria 21–40

400 de itemi suplimentari, cu cerințe dezvoltate și variante apropiate ca lungime, ordonate alfabetic în română. Fiecare test nou include 2 itemi din Bush cap. 1, unul din cap. 2 și unul din cap. 3. PDF-urile au 6 pagini de întrebări și o grilă separată pe pagina 7, fără barem sau explicații.

Cronometrul include tic-tic discret și sonar la intervale de 180 de secunde. Sunetul pornește după interacțiunea cu pagina, poate fi oprit prin buton, iar preferința este păstrată local. Semnalele sunt active pe ecranul testului și în grila de verificare; se opresc la finalizare și la revenirea în listă.

Verificare: `node scripts/validate_content.cjs`, `node scripts/test_app.cjs`, `node scripts/test_audio.cjs`.
