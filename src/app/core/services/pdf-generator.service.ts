import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CandidatoInterface } from '../interfaces/candidato';
import { UsuariosInterface } from '../interfaces/login';

@Injectable({ providedIn: 'root' })
export class PdfGeneratorService {
  private doc!: jsPDF;

  private async imageToBase64(src: string): Promise<string> {
    const existingImg = document.querySelector(`img[src="${src}"]`) as HTMLImageElement;
    if (existingImg && existingImg.complete && existingImg.naturalWidth > 0) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = existingImg.naturalWidth;
        canvas.height = existingImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(existingImg, 0, 0);
          return canvas.toDataURL('image/png');
        }
      } catch {
        // fallback
      }
    }

    try {
      const response = await fetch(src);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(blob);
      });
    } catch {
      return '';
    }
  }

  async generateFichaMacom(macom: UsuariosInterface, idade: number): Promise<void> {
    const pdfW = 210;
    const pdfH = 297;
    const pxPerMm = 4;
    const containerW = pdfW * pxPerMm;

    const grau = this.getGrauSimb(macom);
    const status = macom.status?.status ?? '';
    const grauClass = this.getGrauClass(grau);
    const statusClass = this.getStatusClass(status);

    const fotoUrl = `https://prebellisolucoes.com/FotosUsers/${macom.id}.png`;
    const logoUrl = 'assets/images/logos/salomao.png';

    const [fotoBase64, logoBase64] = await Promise.all([
      this.imageToBase64(fotoUrl),
      this.imageToBase64(logoUrl),
    ]);

    const formatDate = (date: Date | string): string => {
      if (!date) return '-';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString('pt-BR');
    };

    const padCim = (cim: number): string => (cim ?? 0).toString().padStart(6, '0');

    const fotoSrc = fotoBase64 || '';
    const logoSrc = logoBase64 || '';

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${containerW}px`;
    container.style.background = '#ffffff';
    container.style.padding = '0';
    container.style.margin = '0';
    container.style.fontFamily = 'Roboto, "Helvetica Neue", sans-serif';
    container.style.lineHeight = '1.4';

    container.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .page-header {
          background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
          color: white;
          padding: 40px 50px;
          border-radius: 0 0 28px 28px;
          box-shadow: 0 8px 32px rgba(26, 35, 126, 0.3);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .header-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        .title-section h1 {
          font-size: 38px;
          font-weight: 600;
          margin: 0 0 6px 0;
        }

        .subtitle {
          margin: 0 0 16px 0;
          opacity: 0.9;
          font-size: 20px;
        }

        .badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .badge {
          padding: 8px 18px;
          border-radius: 24px;
          font-size: 15px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
        }

        .badge.grau.grau-mestre { background: #ffd700; color: #1a237e; }
        .badge.grau.grau-companheiro { background: #c0c0c0; color: #333; }
        .badge.grau.grau-aprendiz { background: #cd7f32; color: white; }
        .badge.grau.grau-candidato { background: #9e9e9e; color: white; }

        .badge.status.status-ativo { background: #4caf50; color: white; }
        .badge.status.status-inativo { background: #f44336; color: white; }
        .badge.status.status-afastado { background: #ff9800; color: white; }

        .badge.cargo {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .header-logo {
          width: 96px;
          height: 96px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .ficha-content {
          padding: 35px 40px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .card {
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          background: #fff;
        }

        .card-header {
          background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
          padding: 20px 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-header-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a237e;
        }

        .card-body {
          padding: 28px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 10px;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .label {
          font-size: 13px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .value {
          font-size: 17px;
          color: #333;
        }

        .value.highlight {
          color: #1a237e;
          font-weight: 600;
        }

        .value.sangue {
          color: #c62828;
          font-weight: 700;
        }

        .familiares-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .familiar-card {
          background: #f5f5f5;
          border-radius: 14px;
          padding: 20px;
        }

        .familiar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .familiar-nome {
          font-weight: 600;
          color: #1a237e;
          font-size: 17px;
        }

        .familiar-relacao {
          background: #e8eaf6;
          color: #1a237e;
          padding: 3px 12px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .familiar-info {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          color: #666;
        }
      </style>

      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            ${fotoSrc ? `<img src="${fotoSrc}" alt="${macom.nome}" class="header-photo">` : `<div class="header-photo" style="background:#c5cae9;display:flex;align-items:center;justify-content:center;font-size:40px;color:#1a237e;">?</div>`}
            <div>
              <h1>Ficha do Maçom</h1>
              <p class="subtitle">${this.capitalize(macom.nome)}</p>
              <div class="badges">
                <span class="badge grau ${grauClass}">${grau}</span>
                <span class="badge status ${statusClass}">${status}</span>
                ${macom.cargo ? `<span class="badge cargo">${macom.cargo}</span>` : ''}
              </div>
            </div>
          </div>
          ${logoSrc ? `<img src="${logoSrc}" alt="Logo" class="header-logo">` : ''}
        </div>
      </div>

      <div class="ficha-content">
        <div class="card">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#1a237e">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <h2 class="card-header-title">Dados Pessoais</h2>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">CIM</span>
                <span class="value">${padCim(macom.cim ?? 0)}</span>
              </div>
              <div class="info-item">
                <span class="label">CPF</span>
                <span class="value">${macom.cpf}</span>
              </div>
              <div class="info-item">
                <span class="label">RG</span>
                <span class="value">${macom.rg}</span>
              </div>
              <div class="info-item">
                <span class="label">Data de Nascimento</span>
                <span class="value">${formatDate(macom.nascimento)}</span>
              </div>
              <div class="info-item">
                <span class="label">Idade</span>
                <span class="value highlight">${idade} anos</span>
              </div>
              <div class="info-item">
                <span class="label">Tipo Sanguíneo</span>
                <span class="value sangue">${macom.tipoSanguineo}</span>
              </div>
              <div class="info-item">
                <span class="label">Naturalidade</span>
                <span class="value">${macom.naturalidade}/${macom.estado}</span>
              </div>
              <div class="info-item">
                <span class="label">Nacionalidade</span>
                <span class="value">${macom.nacionalidade}</span>
              </div>
              <div class="info-item">
                <span class="label">Pai</span>
                <span class="value">${this.capitalize(macom.pai)}</span>
              </div>
              <div class="info-item">
                <span class="label">Mãe</span>
                <span class="value">${this.capitalize(macom.mae)}</span>
              </div>
              <div class="info-item">
                <span class="label">Profissão</span>
                <span class="value">${this.capitalize(macom.profissao)}</span>
              </div>
              <div class="info-item">
                <span class="label">Telefone</span>
                <span class="value">${macom.fone}</span>
              </div>
              <div class="info-item full-width">
                <span class="label">E-mail</span>
                <span class="value">${macom.email}</span>
              </div>
              <div class="info-item full-width">
                <span class="label">Endereço</span>
                <span class="value">${macom.endereco}, ${macom.numero}, ${macom.bairro} - CEP: ${macom.cep} - ${macom.cidade}/${macom.estado}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#1a237e">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.1v8.79z"/>
            </svg>
            <h2 class="card-header-title">Dados Maçônicos</h2>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Loja</span>
                <span class="value">${macom.loja?.nomeLoja} nº ${macom.loja?.numeroLoja}</span>
              </div>
              <div class="info-item">
                <span class="label">Oriente</span>
                <span class="value">${macom.loja?.oriente}/${macom.loja?.estado}</span>
              </div>
              <div class="info-item">
                <span class="label">Grau Simbólico</span>
                <span class="value">${grau}</span>
              </div>
              <div class="info-item">
                <span class="label">Status</span>
                <span class="value">${status}</span>
              </div>
              <div class="info-item">
                <span class="label">Data de Afiliação</span>
                <span class="value">${formatDate(macom.dataAfiliacao)}</span>
              </div>
              <div class="info-item">
                <span class="label">Forma de Afiliação</span>
                <span class="value">${macom.formaAfiliacao ?? '-'}</span>
              </div>
              <div class="info-item">
                <span class="label">Iniciação</span>
                <span class="value">${formatDate(macom.iniciacao)}</span>
              </div>
              <div class="info-item">
                <span class="label">Elevação</span>
                <span class="value">${formatDate(macom.elevacao)}</span>
              </div>
              <div class="info-item">
                <span class="label">Exaltação</span>
                <span class="value">${formatDate(macom.exaltacao)}</span>
              </div>
              <div class="info-item">
                <span class="label">Cargo em Loja</span>
                <span class="value">${macom.cargo ?? '-'}</span>
              </div>
              <div class="info-item">
                <span class="label">Título</span>
                <span class="value">${macom.titulo ?? '-'}</span>
              </div>
            </div>
          </div>
        </div>

        ${macom.familiares && macom.familiares.length > 0 ? `
        <div class="card">
          <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#1a237e">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            <h2 class="card-header-title">Familiares</h2>
          </div>
          <div class="card-body">
            <div class="familiares-grid">
              ${macom.familiares.map(f => `
                <div class="familiar-card">
                  <div class="familiar-header">
                    <span class="familiar-nome">${this.capitalize(f.familiarNome ?? '')}</span>
                    <span class="familiar-relacao">${f.relacao}</span>
                  </div>
                  <div class="familiar-info">
                    <span>${formatDate(f.nascimentoFamiliar)} (${this.getAge((f.nascimentoFamiliar ?? new Date()).toString())} anos)</span>
                    <span>Tel: ${f.telefone ?? '-'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(container);

    try {
      await new Promise(r => setTimeout(r, 500));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: containerW,
        windowWidth: containerW,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      this.doc = new jsPDF('p', 'mm', 'a4');

      const canvasW = canvas.width;
      const canvasH = canvas.height;
      const imgRatio = canvasW / canvasH;
      const pdfRatio = pdfW / pdfH;

      let renderW: number;
      let renderH: number;

      if (imgRatio > pdfRatio) {
        renderW = pdfW;
        renderH = pdfW / imgRatio;
      } else {
        renderH = pdfH;
        renderW = pdfH * imgRatio;
      }

      const xOffset = (pdfW - renderW) / 2;
      const yOffset = (pdfH - renderH) / 2;

      this.doc.addImage(imgData, 'JPEG', xOffset, yOffset, renderW, renderH);

      this.doc.save(`Ficha - ${macom.nome}.pdf`);
    } finally {
      document.body.removeChild(container);
    }
  }

  async generateFichaCandidato(candidato: CandidatoInterface, idade: number): Promise<void> {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.doc.setFillColor(245, 247, 255);
    this.doc.rect(0, 0, 210, 297, 'F');
    this.drawHeader('FICHA DO CANDIDATO');
    this.drawSection('DADOS PESSOAIS', [
      ['Nome Completo:', candidato.nome],
      ['CPF:', candidato.cpf],
      ['RG:', candidato.rg],
      ['Data de Expedição:', this.formatDate(candidato.dataExpedicao)],
      ['Data de Nascimento:', this.formatDate(candidato.nascimento)],
      ['Idade:', `${idade} anos`],
      ['Tipo Sanguíneo:', candidato.tipoSanguineo],
      ['Naturalidade:', `${candidato.naturalidade}/${candidato.estado}`],
      ['Nacionalidade:', candidato.nacionalidade],
      ['Estado Civil:', candidato.estadoCivil],
      ['Religião:', candidato.religiao],
      ['Acredita em Ser Supremo:', candidato.acreditaSerSupremo ? 'Sim' : 'Não'],
      ['Pai:', candidato.pai],
      ['Pai é Maçom:', candidato.paiMacom ? 'Sim' : 'Não'],
      ['Mãe:', candidato.mae],
      ['Profissão:', candidato.profissao],
      ['Renda:', candidato.renda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
      ['Vícios:', candidato.vicios],
      ['Aptidões:', candidato.aptidoes],
      ['Endereço:', `${candidato.endereco}, ${candidato.numero}, ${candidato.bairro} - CEP: ${candidato.cep} - ${candidato.cidade}/${candidato.estado}`],
      ['Tempo de Moradia:', candidato.tempoMoradia],
      ['Telefone:', candidato.fone],
      ['E-mail:', candidato.email],
      ['Contato de Emergência:', candidato.contatoEmergencia],
      ['Tel. Emergência:', candidato.foneEmergencia],
      ['Família Concorda:', candidato.familiaConcorda ? 'Sim' : 'Não'],
      ['Motivos:', candidato.motivos]
    ]);
    if (candidato.familiares && candidato.familiares.length > 0) {
      const familiaresData = candidato.familiares.map(f => [
        f.familiarNome ?? '',
        f.relacao ?? '',
        this.formatDate(f.nascimentoFamiliar),
        this.getAge((f.nascimentoFamiliar ?? new Date()).toString()) + ' anos',
        f.telefone ?? ''
      ]);
      this.drawFamiliares('FAMILIARES', familiaresData);
    }
    this.doc.save(`Ficha Candidato - ${candidato.nome}.pdf`);
  }

  async generateCarteirinha(macom: UsuariosInterface, idade: number, grau: string, hoje: string, validade: string, nomeLoja: string): Promise<void> {
    const frenteEl = document.querySelector('.carteirinha-frente') as HTMLElement;
    const versoEl = document.querySelector('.carteirinha-verso') as HTMLElement;

    if (!frenteEl || !versoEl) {
      console.error('Elementos da carteirinha não encontrados');
      return;
    }

    await new Promise(r => setTimeout(r, 300));

    const [frenteCanvas, versoCanvas] = await Promise.all([
      html2canvas(frenteEl, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
        foreignObjectRendering: false,
      }),
      html2canvas(versoEl, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
        foreignObjectRendering: false,
      }),
    ]);

    const w = 85.6;
    const h = 53.98;

    this.doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [w, h] });
    this.doc.addImage(frenteCanvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);
    this.doc.addPage([w, h], 'landscape');
    this.doc.addImage(versoCanvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);

    this.doc.save(`CIM ${macom.nome}.pdf`);
  }

  private loadImage(src: string): Promise<string | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  private drawCardInfo(x: number, y: number, label: string, value: string): void {
    this.doc.setFontSize(3.5);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(180, 190, 230);
    this.doc.text(label, x, y);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(4.5);
    this.doc.text(value, x, y + 3);
  }

  private formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('pt-BR');
  }

  private getAge(dateString: string): number {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private getGrauSimb(macom: UsuariosInterface): string {
    if (macom.isMestre) return 'Mestre Maçom';
    if (macom.isCompanheiro) return 'Companheiro de Ofício';
    if (macom.isAprendiz) return 'Aprendiz Maçom';
    return 'Candidato';
  }

  private getGrauClass(grau: string): string {
    if (grau.includes('Mestre')) return 'grau-mestre';
    if (grau.includes('Companheiro')) return 'grau-companheiro';
    if (grau.includes('Aprendiz')) return 'grau-aprendiz';
    return 'grau-candidato';
  }

  private getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('ativo')) return 'status-ativo';
    if (s.includes('inativo')) return 'status-inativo';
    if (s.includes('afastado')) return 'status-afastado';
    return '';
  }

  private pageWidth = 210;
  private pageHeight = 297;
  private margin = 20;
  private y = 0;

  private drawHeader(title: string): void {
    this.doc.setFillColor(26, 35, 126);
    this.doc.rect(0, 0, this.pageWidth, 38, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(22);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.pageWidth / 2, 18, { align: 'center' });
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(200, 210, 255);
    this.doc.text('GRANDE ORIENTE DE SÃO PAULO', this.pageWidth / 2, 28, { align: 'center' });
    this.y = 45;
  }

  private drawSection(title: string, fields: [string, string][]): void {
    if (this.y > this.pageHeight - 30) {
      this.doc.addPage();
      this.doc.setFillColor(245, 247, 255);
      this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
      this.y = this.margin;
    }
    const sectionY = this.y;
    this.doc.setFillColor(26, 35, 126);
    this.doc.roundedRect(this.margin, sectionY, this.pageWidth - this.margin * 2, 7, 1.5, 1.5, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 3, sectionY + 5);
    this.y = sectionY + 11;
    for (const [label, value] of fields) {
      if (this.y > this.pageHeight - 12) {
        this.doc.addPage();
        this.doc.setFillColor(245, 247, 255);
        this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
        this.y = this.margin;
      }
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(120, 130, 180);
      this.doc.text(label, this.margin + 5, this.y);
      this.doc.setTextColor(51, 51, 51);
      this.doc.setFont('helvetica', 'normal');
      const maxWidth = this.pageWidth - this.margin * 2 - 50;
      const lines = this.doc.splitTextToSize(value, maxWidth);
      this.doc.text(lines, this.margin + 55, this.y);
      this.y += lines.length * 4 + 1.5;
    }
    this.y += 3;
  }

  private drawFamiliares(title: string, familiares: string[][]): void {
    if (this.y > this.pageHeight - 30) {
      this.doc.addPage();
      this.doc.setFillColor(245, 247, 255);
      this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
      this.y = this.margin;
    }
    const sectionY = this.y;
    this.doc.setFillColor(26, 35, 126);
    this.doc.roundedRect(this.margin, sectionY, this.pageWidth - this.margin * 2, 7, 1.5, 1.5, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 3, sectionY + 5);
    this.y = sectionY + 11;
    for (const [nome, relacao, nascimento, idade, telefone] of familiares) {
      if (this.y > this.pageHeight - 18) {
        this.doc.addPage();
        this.doc.setFillColor(245, 247, 255);
        this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
        this.y = this.margin;
      }
      this.doc.setFillColor(255, 255, 255);
      this.doc.roundedRect(this.margin + 5, this.y, this.pageWidth - this.margin * 2 - 10, 12, 2, 2, 'F');
      this.doc.setDrawColor(220, 225, 245);
      this.doc.setLineWidth(0.3);
      this.doc.roundedRect(this.margin + 5, this.y, this.pageWidth - this.margin * 2 - 10, 12, 2, 2, 'S');
      this.doc.setFontSize(8.5);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(26, 35, 126);
      this.doc.text(nome, this.margin + 8, this.y + 4.5);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(6.5);
      this.doc.setTextColor(100, 100, 120);
      this.doc.text(`${relacao} | ${nascimento} (${idade}) | Tel: ${telefone}`, this.margin + 8, this.y + 8.5);
      this.y += 15;
    }
  }

  private capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
