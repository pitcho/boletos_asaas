function exportSheet(sheetName) {   
  var sheetName = 'Prestação de contas';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetName() !== sheetName) {
      sheets[i].hideSheet()
    }
  }
  
  var FolderName = ss.getRange('B4').getValue();
  var nomedoArquivo = ss.getRange('B3').getValue();
  nomedoArquivo = '10-20 - ' + nomedoArquivo + '.pdf'
  arquivo = ss.getBlob();
  arquivo.setName(nomedoArquivo);
  var dir = DriveApp.getFoldersByName(FolderName).next();
  var file = dir.createFile(arquivo);
  for (var i = 0; i < sheets.length; i++) {
    sheets[i].showSheet()
  }
}

function mostraTodas()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    sheets[i].showSheet()
  }
}

function escondeTodas(sheetName) {
  var sheetName = 'Prestação de contas';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetName() !== sheetName) {
      sheets[i].hideSheet()
    }
  }

}

function mostraImportantes() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    switch(sheets[i].getSheetName()){
      case 'Dados':           sheets[i].showSheet(); break;
      case 'Condominios':     sheets[i].showSheet(); break;
      case 'Prestação de contas':  sheets[i].showSheet(); break;  
      case 'Boletos':  sheets[i].showSheet(); break;  
      default: sheets[i].hideSheet();
    };
  }
  
}

function GeraDocs()
{
  //var mes = '01-21'
  var mes = Utilities.formatDate(new Date(), "GMT-3", "MM-yy")
  var pcontas = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prestação de contas')
  var pdados = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dados') 
  var value = pcontas.getRange('B5').getValue();
 
  for ( var linha = 2; linha <= 48; linha++ ) {
    var v2 = pdados.getRange(linha, 1).getValue();
    if ( v2 == "" )
    {
      continue;
    }
    var locatario = pcontas.getRange(4, 2).getValue();
    pcontas.getRange("B5").setValue(v2)
//    SpreadsheetApp.getUi().alert("Valor em Dados A" + linha + " é: "+ v2);

    var FolderName = pcontas.getRange('B4').getValue();
    var nomedoArquivo = pcontas.getRange('B3').getValue();
    //SpreadsheetApp.getUi().alert("Valor em PContas B4 é: ("+ FolderName + ") linha: " + linha);

    nomedoArquivo = mes + ' - ' + nomedoArquivo + '.pdf'
    arquivo = SpreadsheetApp.getActiveSpreadsheet().getBlob()
    arquivo.setName(nomedoArquivo);
    var dir = DriveApp.getFoldersByName(FolderName).next();
    var pastames = dir.getFoldersByName(mes).next();
    var file = pastames.createFile(arquivo)
    
  }
  
}

function busca_proximo_inquilino()
{
  // Planilha Extrato Asaas
  var planilha_extrato = SpreadsheetApp.openById("ID DA PLANILHA DE EXTRATO")
  var mes = Utilities.formatDate(new Date(), "GMT-3", "MM-yy")
  //Abre a aba MM-YY da planilha Extrato Asaas
  var extrato_mes = planilha_extrato.getSheetByName(mes)
  var pcontas = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prestação de contas')
  var inquilino = pcontas.getRange('B5').getValue()
  
  var pagantes = extrato_mes.getRange(5,2,40,1).getValues()
  for (i=0; i < pagantes.length && pagantes[i][0] !== ''; i++ )
  {
    if (pagantes[i][0] === inquilino)
    {
      if (i+1 < pagantes.length && pagantes[i+1][0] !== '' )
      {
        Logger.log(pagantes[i+1][0])
        pcontas.getRange("B5").setValue(pagantes[i+1][0])
      }
      else
      {
        Logger.log(pagantes[0][0])
        pcontas.getRange("B5").setValue(pagantes[0][0])
      }
      break
    }
    Logger.log('i: ' + i + ' Valor: ' + pagantes[i][0])

  }

}



















