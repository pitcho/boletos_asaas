function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Imobiliaria')
      .addItem('Apagar boletos de conferência', 'apaga_boletos_homologacao')
      .addItem('Salvar Prestações', 'SalvarPrestacoes')
      .addSeparator()
      .addSubMenu(ui.createMenu('Boletos')
          .addItem('Boletos para conferência', 'GeraBoletosTeste')
          .addItem('Emitir boletos aos clientes', 'GeraBoletosProducao'))
      .addSeparator()
      .addSubMenu(ui.createMenu('Clientes')        
          .addItem('Sincronizar clientes no Asaas - Homologação', 'menuAtualizaClientesH')
          .addItem('Sincronizar clientes no Asaas - Producao', 'menuAtualizaClientesP'))
      .addToUi();
}

function apaga_boletos_homologacao() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Remover as cobranças de conferência?', 'Somente os boletos de teste são removidos.\nDeseja continuar?', ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES) {
    Logger.log('The user clicked "Yes."');
    apaga_cobrancas()
  } else {
    Logger.log('The user clicked "No" or the close button in the dialog\'s title bar.');
  }
}

function menuItem2() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .alert('Você clicou no menu Atualizar clientes no Asaas! - homologação');
}

function menuItem3() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .alert('Você clicou no menu Atualizar clientes no Asaas! - Produção');
}


function SalvarPrestacoes () {
  escondeTodas()
  GeraDocs()
  mostraImportantes()
}


function GeraBoletosProducao () {

  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Emitir boletos', 'Esta operação não tem volta\nDigite "Sim, tenho certeza!"\nPara emitir os boletos.', ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  if (response.getSelectedButton() == ui.Button.OK) {
    if ( response.getResponseText() == 'Sim, tenho certeza!') {
      Logger.log('Emitir Boletos!');
      runAsaas(true)
    }
  } else if (response.getSelectedButton() == ui.Button.CANCEL) {
    Logger.log('Emissao cancelada');
  } else {
    Logger.log('Emissao cancelada, botão fechar da janela');
  }   
}

function GeraBoletosTeste () {

  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Emitir boletos para conferencia?', 'Esta operação gera boletos apenas para conferência.\nDeseja continuar?', ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES) {
    Logger.log('The user clicked "Yes."');
    runAsaas()
  } else {
    Logger.log('The user clicked "No" or the close button in the dialog\'s title bar.');
  }
  
}


function menuAtualizaClientesH () {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Atualizar dados de clientes Asaas - Homologacao', 'Esta operação utilizar o intervalo nomeado "boletos".\nDeseja continuar?', ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES) {
    //AtualizaClientes()
    compara_cliente()
  } else {
    Logger.log('The user clicked "No" or the close button in the dialog\'s title bar.');
  }
  
}

function menuAtualizaClientesP () {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Atualizar dados de clientes Asaas - Produção', 'Esta operação utilizar o intervalo nomeado "boletos".\nDeseja continuar?', ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES) {
    //AtualizaClientes(true)
    compara_cliente(true)
  } else {
    Logger.log('The user clicked "No" or the close button in the dialog\'s title bar.');
  }
  
}



