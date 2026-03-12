import { Component, OnInit, NgModule, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { StatusInterface } from './../../../core/interfaces/status';
import { LojasInterface } from 'src/app/core/interfaces/lojas';
import { LojasService } from 'src/app/core/services/lojas.service';
import { UsuariosInterface } from 'src/app/core/interfaces/login';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-macon',
  templateUrl: './macon.component.html',
  styleUrls: ['./macon.component.scss']
})
export class MaconComponent implements OnInit {
  busy=false;
  hide=true;
  idFotoEditar=0
  file!: File;
  listaEstados=['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
  listaFormas=['Iniciação','Afiliação','Transferência']
  listaStatus:StatusInterface[] = []
  arquivoFoto!:string|ArrayBuffer|null;
  listaLojas:LojasInterface[]=[]
 macomForm:FormGroup = new FormGroup({
    id: new FormControl(0,[Validators.required]),
    nome: new FormControl('',[Validators.required]),
    cim: new FormControl(''),
    cpf: new FormControl('',[Validators.required]),
    rg: new FormControl('',[Validators.required]),
    nascimento: new FormControl('',[Validators.required]),
    naturalidade: new FormControl(''),
    estado: new FormControl('',[Validators.required]),
    nacionalidade: new FormControl('',[Validators.required]),
    estadoCivil: new FormControl('',[Validators.required]),
    tipoSanguineo: new FormControl(''),
    cep: new FormControl('',[Validators.required]),
    profissao: new FormControl('',[Validators.required]),
    endereco: new FormControl('',[Validators.required]),
    numero: new FormControl('',[Validators.required]),
    cidade: new FormControl('',[Validators.required]),
    bairro: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    fone: new FormControl('',[Validators.required]),
    pai: new FormControl('',[Validators.required]),
    mae: new FormControl('',[Validators.required]),
    iniciacao: new FormControl('',[Validators.required]),
    elevacao: new FormControl(null),
    exaltacao: new FormControl(null),
    observacoes: new FormControl(''),
    contatoEmergencia:new FormControl('',[Validators.required]),
    foneEmergencia:new FormControl('',[Validators.required]),
    isCandidato:new FormControl(false,[Validators.required]),
    isAprendiz:new FormControl(true,[Validators.required]),
    isCompanheiro:new FormControl(false,[Validators.required]),
    isMestre:new FormControl(false,[Validators.required]),
    isAdmin:new FormControl(false,[Validators.required]),
    isSuperAdmin:new FormControl(false,[Validators.required]),
    pass: new FormControl('',[Validators.required]),
    dataAfiliacao: new FormControl('',[Validators.required]),
    formaAfiliacao: new FormControl('',[Validators.required]),
    cargo: new FormControl(''),
    titulo: new FormControl(''),
    statusId: new FormControl(1,[Validators.required]),
    lojaId: new FormControl(0,[Validators.required]),
  })
  foto=''
  textoFoto='Escolha uma imagem'
  acao = 'criar'

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: "top",
      panelClass: isError ? ['msg-error'] : ['msg-success']
    })
  }  
  constructor(private route:ActivatedRoute,private usuarioService:AuthService,private snackBar: MatSnackBar,private router:Router,private lojasService:LojasService){}
  ngOnInit(): void {
   
    this.busy = true
    var id = this.route.snapshot.paramMap.get('id')!=null?this.route.snapshot.paramMap.get('id'):'0';
    if(id=='0'){
      this.acao = "criar"
    }else{
      this.acao = "editar"
      this.usuarioService.verMacom(id?parseInt(id):0).subscribe(data=>{
        this.preencheForm(data)
        this.macomForm.get('pass')?.disabled
      })
    }
          this.usuarioService.listarStatus().subscribe(data=>{
            this.listaStatus = data
            
            this.lojasService.verLojasAtivas().subscribe(data=>{
              this.listaLojas = data
              this.busy= false
            })
          })
  }

  onFileChange(event:any){
    this.file = <File>event.target.files[0]

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
       var ok = event.target.result;
       this.arquivoFoto = ok
       this.foto = this.arquivoFoto?.toString()?this.arquivoFoto?.toString():''
      }
      reader.readAsDataURL(event.target.files[0]);
      this.textoFoto = this.file.name
    }
  }
  escolheFoto(){
    document.getElementById('input-file')!.click();
  }
  formataData(data:any){
    var stringData = new Date(data).toLocaleDateString()
    var splitData = stringData.split("/").reverse()
    var dataFormatada = splitData[0]+"-"+splitData[1]+"-"+splitData[2]
    return dataFormatada
  }
  preencheForm(data:any){
    this.macomForm.get('bairro')?.setValue(data.bairro)
    this.macomForm.get('cargo')?.setValue(data.cargo)
     this.macomForm.get('cep')?.setValue(data.cep)
    this.macomForm.get('cidade')?.setValue(data.cidade)
     this.macomForm.get('cim')?.setValue(data.cim)
    this.macomForm.get('contatoEmergencia')?.setValue(data. contatoEmergencia)
     this.macomForm.get('cpf')?.setValue(data.cpf)
     this.macomForm.get('dataAfiliacao')?.setValue(this.formataData(data.dataAfiliacao))
     this.macomForm.get('elevacao')?.setValue(this.formataData(data.elevacao))
   this.macomForm.get('email')?.setValue( data.email)
     this.macomForm.get('endereco')?.setValue(data.endereco)
     this.macomForm.get('estado')?.setValue(data.estado)
     this.macomForm.get('estadoCivil')?.setValue(data.estadoCivil)
    this.macomForm.get('exaltacao')?.setValue(this.formataData(data.exaltacao))
     this.macomForm.get('fone')?.setValue(data.fone)
     this.macomForm.get('foneEmergencia')?.setValue(data.foneEmergencia)
     this.macomForm.get('formaAfiliacao')?.setValue(data.formaAfiliacao)
     this.macomForm.get('id')?.setValue(data.id)
     this.macomForm.get('iniciacao')?.setValue(this.formataData(data.iniciacao))
     this.macomForm.get('isAdmin')?.setValue(data.isAdmin)
     this.macomForm.get('isSuperAdmin')?.setValue(data.isSuperAdmin)
     this.macomForm.get('isAprendiz')?.setValue(data.isAprendiz)
     this.macomForm.get('isCandidato')?.setValue(data.isCandidato)
     this.macomForm.get('isCompanheiro')?.setValue(data.isCompanheiro)
     this.macomForm.get('isMestre')?.setValue(data.isMestre)
     this.macomForm.get('lojaId')?.setValue(data.lojaId)
     this.macomForm.get('mae')?.setValue(data.mae)
    this.macomForm.get('nacionalidade')?.setValue(data.nacionalidade)
     this.macomForm.get('nascimento')?.setValue(this.formataData(data.nascimento))
     this.macomForm.get('naturalidade')?.setValue(data.naturalidade)
     this.macomForm.get('nome')?.setValue(data.nome)
     this.macomForm.get('numero')?.setValue(data.numero)
     this.macomForm.get('observacoes')?.setValue(data.observacoes)
     this.macomForm.get('pai')?.setValue(data.pai)
    this.macomForm.get('pass')?.setValue(data.pass)
     this.macomForm.get('profissao')?.setValue(data.profissao)
     this.macomForm.get('rg')?.setValue(data.rg)
    this.macomForm.get('statusId')?.setValue(data.statusId)
     this.macomForm.get('tipoSanguineo')?.setValue(data.tipoSanguineo)
     this.macomForm.get('titulo')?.setValue(data.titulo)
    this.idFotoEditar = data.fotoId
    this.foto = "data:image/png;base64,"+data.foto.fotoFile
    console.log(this.foto)
  }
  salvar(){
    this.busy = true
    var userEnviar: UsuariosInterface = {
      bairro: this.macomForm.value.bairro,
      cargo: this.macomForm.value.cargo,
      cep: this.macomForm.value.cep,
      cidade: this.macomForm.value.cidade,
      cim: this.macomForm.value.cim!=''?parseInt(this.macomForm.value.cim):0,
      contatoEmergencia: this.macomForm.value.contatoEmergencia,
      cpf: this.macomForm.value.cpf.replace("-","").replace(".","").replace("/",""),
      dataAfiliacao: this.macomForm.value.dataAfiliacao,
      elevacao: this.macomForm.value.elevacao,
      email: this.macomForm.value.email,
      endereco: this.macomForm.value.endereco,
      estado: this.macomForm.value.estado,
      estadoCivil: this.macomForm.value.estadoCivil,
      exaltacao: this.macomForm.value.exaltacao,
      fone: this.macomForm.value.fone,
      foneEmergencia: this.macomForm.value.foneEmergencia,
      formaAfiliacao: this.macomForm.value.formaAfiliacao,
      id: this.macomForm.value.id,
      iniciacao: this.macomForm.value.iniciacao,
      isAdmin: this.macomForm.value.isAdmin,
      isSuperAdmin: this.macomForm.value.isSuperAdmin,
      isAprendiz: this.macomForm.value.isAprendiz,
      isCandidato: this.macomForm.value.isCandidato,
      isCompanheiro: this.macomForm.value.isCompanheiro,
      isMestre: this.macomForm.value.isMestre,
      lojaId: this.macomForm.value.lojaId,
      mae: this.macomForm.value.mae,
      nacionalidade: this.macomForm.value.nacionalidade,
      nascimento: this.macomForm.value.nascimento,
      naturalidade: this.macomForm.value.naturalidade,
      nome: this.macomForm.value.nome,
      numero: this.macomForm.value.numero,
      observacoes: this.macomForm.value.observacoes,
      pai: this.macomForm.value.pai,
      pass: this.macomForm.value.pass,
      profissao: this.macomForm.value.profissao,
      rg: this.macomForm.value.rg.replace("-","").replace(".","").replace("/",""),
      statusId: this.macomForm.value.statusId,
      tipoSanguineo: this.macomForm.value.tipoSanguineo,
      titulo: this.macomForm.value.titulo,   
    }


    this.usuarioService.cadastrarMacom(userEnviar).subscribe(data=>{
      this.usuarioService.gravarFotoIUser(this.file,data.id).subscribe(dataFoto=>{
        this.showMessage("Maçom cadastrado com sucesso",false)
        this.busy=false
        this.router.navigate(['/cadastros/macons'])
      },error=>{
        this.showMessage("Houve um erro, contate o administrador",true)
        this.busy=false
      })
},error=>{
  this.showMessage("Houve um erro, contate o administrador",true)
  this.busy=false
})


  }

}
