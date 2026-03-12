import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { HomeLogadoComponent } from './pages/home-logado/home-logado.component';
import { HeaderComponent } from './pages/shared/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import { NoticiasComponent } from './pages/cadastros/noticias/noticias.component';
import { BreadcumbComponent } from './pages/shared/breadcumb/breadcumb.component';
import {MatTableModule} from '@angular/material/table';
import { NoticiaFormComponent } from './pages/cadastros/noticia-form/noticia-form.component';
import { MaconsComponent } from './pages/cadastros/macons/macons.component';
import { MaconComponent } from './pages/cadastros/macon/macon.component';
import { QtdNumerosPipe } from './core/pipes/qtd-numeros.pipe';
import {LOCALE_ID, DEFAULT_CURRENCY_CODE} from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FichaMacomComponent } from './pages/shared/ficha-macom/ficha-macom.component';
import { HomePainelComponent } from './pages/painel/home-painel/home-painel.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CandidatosComponent } from './pages/cadastros/candidatos/candidatos.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ModalFamiliarComponent } from './pages/shared/modal-familiar/modal-familiar.component';
import { ListaCandidatosComponent } from './pages/cadastros/lista-candidatos/lista-candidatos.component';
import { ModalTokenComponent } from './pages/shared/modal-token/modal-token.component';
import { FichaCandidatoComponent } from './pages/shared/ficha-candidato/ficha-candidato.component';
import { AcreditaPipe } from './core/pipes/acredita.pipe';
import {MatExpansionModule} from '@angular/material/expansion';
import { BibliotecaComponent } from './pages/biblioteca/biblioteca.component';
import { DocumentoComponent } from './pages/cadastros/macon/documento/documento.component';


registerLocaleData(ptBr);

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeLogadoComponent,
    HeaderComponent,
    NoticiasComponent,
    BreadcumbComponent,
    NoticiaFormComponent,
    MaconsComponent,
    MaconComponent,
    QtdNumerosPipe,
    FichaMacomComponent,
    HomePainelComponent,
    CandidatosComponent,
    ModalFamiliarComponent,
    ListaCandidatosComponent,
    ModalTokenComponent,
    FichaCandidatoComponent,
    AcreditaPipe,
    BibliotecaComponent,
    DocumentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
MatIconModule,
MatButtonModule,
MatSnackBarModule,
MatMenuModule,
MatTableModule,
NgxMaskModule.forRoot(maskConfig),
CurrencyMaskModule,
MatDatepickerModule,
MatNativeDateModule ,
MatSelectModule,
MatSlideToggleModule,
MatTabsModule,
MatDialogModule,
MatExpansionModule,

    
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'pt-BR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
