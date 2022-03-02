function set_env(Prod = false) {
 // var Prod = false;

  var myEnv = {}
  if( Prod == true ) {

    var url = 'https://www.asaas.com'
    var access_token = ''
  } 
  else {
    var url = 'https://sandbox.asaas.com'
    var access_token = ''
  }   

  var headers = {
    'access_token': access_token
  }
 
  myEnv.url = url
  myEnv.access_token = access_token
  myEnv.Prod = Prod
  return myEnv 
}

function get_customer_id(cpf="99999999999", Prod=false) {
  var myEnv = set_env(Prod)
  var url = myEnv.url + '/api/v3/customers?cpfCnpj=' + cpf
  var headers = {
                 "contentType": "application/json",
    "headers" : { "access_token" : myEnv.access_token }
               };
  var response = UrlFetchApp.fetch(url, headers);
  var json = response.getContentText();
  var data = JSON.parse(json);
  //Logger.log(data);
  return data.data[0].id
 
               
} 

function get_customer(cpf="99999999999", Prod=false) {
  //Retonar todos os dados do cliente
  var myEnv = set_env(Prod)
  var url = myEnv.url + '/api/v3/customers?cpfCnpj=' + cpf
  var headers = {
                 "contentType": "application/json",
    "headers" : { "access_token" : myEnv.access_token }
               };
  var response = UrlFetchApp.fetch(url, headers);
  var json = response.getContentText();
  var data = JSON.parse(json);
  //Logger.log(data.data[0].name);
  return data.data[0]
 
               
} 

function prepara_boleto( boleto, Prod ) {
  var payload = {}

  payload.customer = get_customer_id( boleto.cpf, Prod )
  payload.billingType = "BOLETO"
  payload.dueDate = boleto.dueDate
  payload.value = boleto.value
   
  msg = "Aluguel: " + boleto.aluguel
  
  if ( boleto.desconto != "R$ 0,00" ) 
  {
    msg += '\nDesconto: ' +  boleto.desconto 
  }
  
  if ( boleto.condominio != "R$ 0,00" ) 
  {
    msg += '\nCondominio: ' +  boleto.condominio
  }
  
  if ( boleto.iptu != "R$ 0,00" ) 
  {
    msg += '\nIPTU: ' +  boleto.iptu 
  }
  
  if ( boleto.outros != "R$ 0,00" ) 
  {
    msg += '\n' + boleto.outros_desc + ': ' +  boleto.outros 
  }
  msg += '\nBoleto R$ 3,00\n' + boleto.mensagem
  payload.description = msg
        
  payload.postalService = 'false'
  //Logger.log(payload)  
  return JSON.stringify(payload)
}

function gera_boleto(payload,Prod=false) {
  var myEnv = set_env(Prod)
  var url = myEnv.url + '/api/v3/payments'
  
  

  var options = {
    "method": "POST",
    "contentType": "application/json",
    "headers" : { "access_token" : myEnv.access_token },
    "payload" : payload
               };
  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  var data = JSON.parse(json);
  //Logger.log(data);
  //  Logger.log(options)
  //  Logger.log('gera_boleto URL: ' + url)

  return data.invoiceUrl
  
  
}

function runAsaas(Prod=false) {
  
  var sBoletos = SpreadsheetApp.getActive().getSheetByName('Boletos')
  var nr_boletos = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('boletos');
  var boleto = {}
  
  for ( var linha = 1; linha <= nr_boletos.getNumRows(); linha++ )
  {
    var cpf = nr_boletos.getCell(linha, 2).getValue()
    if ( cpf != "" )
    {     
      boleto.cpf = cpf
      boleto.dueDate = nr_boletos.getCell(linha, 12).getValue();
      boleto.value = nr_boletos.getCell(linha, 24).getValue();
      boleto.aluguel = nr_boletos.getCell(linha, 13).getDisplayValue()
      boleto.desconto = nr_boletos.getCell(linha, 15).getDisplayValue()
      boleto.condominio = nr_boletos.getCell(linha, 16).getDisplayValue()
      boleto.iptu = nr_boletos.getCell(linha, 18).getDisplayValue()
      boleto.outros = nr_boletos.getCell(linha, 20).getDisplayValue()
      boleto.outros_desc = nr_boletos.getCell(linha, 19).getValue();
      boleto.mensagem = nr_boletos.getCell(linha, 21).getValue();

      payload = prepara_boleto( boleto, Prod)
      var link_boleto = gera_boleto(payload, Prod)
      //Logger.log(link_boleto)
      //Logger.log(payload)
      nr_boletos.getCell( linha, 23 ).setValue(link_boleto)
            
      //cliente = get_customer(boleto.cpf)
      //nr_boletos.getCell( linha, 26 ).setValue(cliente.name)
      
      
    }
  }

}

function CriaClientes(Prod=false) {
  var sBoletos = SpreadsheetApp.getActive().getSheetByName('Boletos')
  var nr_boletos = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('novocliente');
  var myEnv = set_env(Prod)
  
  var url = myEnv.url + '/api/v3/customers'
  
  
  var payload = {}
  
  for ( var linha = 1; linha <= nr_boletos.getNumRows(); linha++ )
  {
    var cpf = nr_boletos.getCell(linha, 2).getValue()
    if ( cpf != "" )
    {
      payload.name = nr_boletos.getCell(linha, 1).getValue();
      if ( nr_boletos.getCell(linha, 4).getValue() == "" )
      {
        payload.email="pitcho@gmail.com"
      } else
      {
        payload.email = nr_boletos.getCell(linha, 4).getValue()
      }
      payload.phone=nr_boletos.getCell(linha, 3).getValue()
      payload.mobilePhone=nr_boletos.getCell(linha, 3).getValue()
      payload.cpfCnpj=cpf
      payload.address = nr_boletos.getCell(linha, 5).getValue()
      payload.province = nr_boletos.getCell(linha, 8).getValue()
      payload.city = nr_boletos.getCell(linha, 10).getValue()
      payload.postalCode = nr_boletos.getCell(linha, 9).getValue()
      payload.addressNumber = nr_boletos.getCell(linha, 6).getValue()
      payload.complement = nr_boletos.getCell(linha, 7).getValue()
      if ( Prod == true )
      {
        payload.notificationDisabled = 'false'
      } 
      else {
        payload.notificationDisabled = 'true'
      }
      
      
      var options = {
            "method": "POST",
            "contentType": "application/json",
            "headers" : { "access_token" : myEnv.access_token },
                           "payload" : JSON.stringify(payload)
             };

      var response = UrlFetchApp.fetch(url, options);
      var json = response.getContentText();
      var data = JSON.parse(json);
      Logger.log(options);
      Logger.log(data)
      //return data.invoiceUrl
    }
  } 
}



function AtualizaClientes (Prod=false) {
  var sBoletos = SpreadsheetApp.getActive().getSheetByName('Boletos')
  var nr = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('AtualizaClientes');
  var myEnv = set_env(Prod)
  
  var url = myEnv.url + '/api/v3/customers'
  
  
  
  var payload = {}
  
  for ( var linha = 1; linha <= nr.getNumRows(); linha++ )
  {
    var cpf = nr.getCell(linha, 2).getValue()
    if ( cpf != "" )
    {
      var customer_id = get_customer_id( cpf, Prod )
      url = myEnv.url + '/api/v3/customers/' + customer_id
      payload.name = nr.getCell(linha, 1).getValue();
      if ( nr.getCell(linha, 4).getValue() == "" )
      {
        payload.email="pitcho@gmail.com"
      } else
      {
        payload.email = nr.getCell(linha, 4).getValue()
      }
      payload.phone=nr.getCell(linha, 3).getValue()
      payload.mobilePhone=nr.getCell(linha, 3).getValue()
      payload.cpfCnpj=cpf
      payload.address = nr.getCell(linha, 5).getValue()
      payload.province = nr.getCell(linha, 8).getValue()
      payload.city = nr.getCell(linha, 10).getValue()
      payload.postalCode = nr.getCell(linha, 9).getValue()
      payload.addressNumber = nr.getCell(linha, 6).getValue()
      payload.complement = nr.getCell(linha, 7).getValue()
      if ( myEnv.Prod == true )
      {
        payload.notificationDisabled = 'false'
      } else
      {
        payload.notificationDisabled = 'true'
      }
      
      
      var options = {
            "method": "POST",
            "contentType": "application/json",
            "headers" : { "access_token" : myEnv.access_token },
                           "payload" : JSON.stringify(payload)
             };

      var response = UrlFetchApp.fetch(url, options);
      var json = response.getContentText();
      var data = JSON.parse(json);
      Logger.log(data);
      //Logger.log(options);
      //return data.invoiceUrl
    }
  } 
}

function compara_cliente(Prod=false) {

  var sBoletos = SpreadsheetApp.getActive().getSheetByName('Boletos')
  var nr_boletos = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('boletos');
  var myEnv = set_env(Prod)
  
  //var url = myEnv.url + '/api/v3/customers'
  
  
  
  var cliente_na_planilha = {}
  
  for ( var linha = 1; linha <= nr_boletos.getNumRows(); linha++ )
  {
    var cpf = nr_boletos.getCell(linha, 2).getValue()
    if ( cpf != "" )
    {
      cliente_na_planilha.name = nr_boletos.getCell(linha, 1).getValue();
      if ( nr_boletos.getCell(linha, 4).getValue() == "" )
      {
        cliente_na_planilha.email="pitcho@gmail.com"
      } else
      {
        cliente_na_planilha.email = nr_boletos.getCell(linha, 4).getValue()
      }
      cliente_na_planilha.phone=nr_boletos.getCell(linha, 3).getValue()
      cliente_na_planilha.mobilePhone=nr_boletos.getCell(linha, 3).getValue()
      cliente_na_planilha.cpfCnpj=cpf
      cliente_na_planilha.address = nr_boletos.getCell(linha, 5).getValue()
      cliente_na_planilha.province = nr_boletos.getCell(linha, 8).getValue()
      cliente_na_planilha.city = nr_boletos.getCell(linha, 10).getValue()
      cliente_na_planilha.postalCode = nr_boletos.getCell(linha, 9).getValue()
      cliente_na_planilha.addressNumber = nr_boletos.getCell(linha, 6).getValue()
      cliente_na_planilha.complement = nr_boletos.getCell(linha, 7).getValue()
      if ( Prod == true )
      {
        cliente_na_planilha.notificationDisabled = 'false'
      } 
      else {
        cliente_na_planilha.notificationDisabled = 'true'
      }
    
      from_asaas = get_customer(cpf, myEnv.Prod)

      if( from_asaas != null )
      {        
        if ((from_asaas.name != cliente_na_planilha.name) || 
            (from_asaas.address != cliente_na_planilha.address) ||
            (from_asaas.mobilePhone != cliente_na_planilha.phone) ||
            (from_asaas.addressNumber != cliente_na_planilha.addressNumber) ||
            (from_asaas.complement != cliente_na_planilha.complement)) {
          
          //Logger.log(from_asaas.name != cliente_na_planilha.name)
          //Logger.log(from_asaas.address != cliente_na_planilha.address)          
          //Logger.log(from_asaas.addressNumber != cliente_na_planilha.addressNumber)
          //Logger.log(from_asaas.complement != cliente_na_planilha.complement)
          
          Logger.log(from_asaas.name + '\n' + cliente_na_planilha.name + '\n' +
                        from_asaas.address + '\n' + cliente_na_planilha.address + '\n' +
                        from_asaas.mobilePhone + '\n' + cliente_na_planilha.phone + '\n' +
                        from_asaas.addressNumber + '\n' + cliente_na_planilha.addressNumber + '\n' +
                        from_asaas.complement + '\n' + cliente_na_planilha.complement
          
          )

          //Logger.log(from_asaas)
          //Logger.log(cliente_na_planilha)
          sincroniza_cliente_asaas(cliente_na_planilha, "atualizar", myEnv.Prod)

        }
        
      }
      else
      {
        //CriaClientes
        sincroniza_cliente_asaas(cliente_na_planilha, "criar", myEnv.Prod)
        //Logger.log('Criar Cliente: ')
        //Logger.log(cliente_na_planilha)
      }
    }    
  }
}

function sincroniza_cliente_asaas (cliente=null, acao=null, Prod=false) {
  if ( (cliente == null) || (acao == null))
  {
    return 0
  }  
  var myEnv = set_env(Prod)  

  switch (acao) {
    case "criar":
      var url = myEnv.url + '/api/v3/customers'
      break
    case "atualizar":
      var customer_id = get_customer_id( cliente.cpfCnpj, Prod )
      url = myEnv.url + '/api/v3/customers/' + customer_id
      break
    
    default:
      return 0
  }
    
  /*Logger.log(myEnv)
  Logger.log(acao)
  Logger.log(cliente)*/
  
  var options = {
        "method": "POST",
        "contentType": "application/json",
        "headers" : { "access_token" : myEnv.access_token },
                       "payload" : JSON.stringify(cliente)
         };

      var response = UrlFetchApp.fetch(url, options);
      var json = response.getContentText();
      var data = JSON.parse(json);
      Logger.log(data);
      //Logger.log(options);
      //return data.invoiceUrl
    
   
}




function apaga_cobrancas(Prod=false) {

  var myEnv = set_env(Prod)
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();  
  var day = d.getDay();
  var c = new Date(year , month -1 , day);
  inicio = Utilities.formatDate(c, "GMT-3", "yyyy-MM")
  fim = Utilities.formatDate(new Date( ), "GMT-3", "yyyy-MM");
  inicio += '-01'
  fim += '-06'
  
  var url = myEnv.url + '/api/v3/payments/?dueDate%5Bge%5D=' + inicio + '&dueDate%5Ble%5D=' + fim + '&limit=100'
  var headers = {
                 "contentType": "application/json",
    "headers" : { "access_token" : myEnv.access_token }
               };
  var response = UrlFetchApp.fetch(url, headers);
  var json = response.getContentText();
  var data = JSON.parse(json);
  //Logger.log(data);
  for ( var i=0; i < data.totalCount; i++)
  {
    apaga_cobranca_asaas(data.data[i].id)
    //Logger.log(data.data[i].id)
    //Logger.log(i)
  } 
}

function apaga_cobranca_asaas(pay_id="pay_794980854840", Prod=false) {
  var myEnv = set_env(Prod)
  var url = myEnv.url + '/api/v3/payments/' + pay_id
  var options = {
            "method": "DELETE",
            "contentType": "application/json",
            "headers" : { "access_token" : myEnv.access_token },
             };
  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  var data = JSON.parse(json);
  Logger.log(data)
}
