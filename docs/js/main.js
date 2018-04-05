//referencia do banco de dados firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBWpUQ7MGjCFkT3tFv1mLBU0PKxaC1V0jA",
    authDomain: "realchat-493cf.firebaseapp.com",
    datahorabaseURL: "https://realchat-493cf.firebaseio.com",
    projectId: "realchat-493cf",
    storageBucket: "realchat-493cf.appspot.com",
    messagingSenderId: "199166590696"
  };
  firebase.initializeApp(config);

let feedSuccess = $("#feedSuccess");
let feedError = $("#feedError");
let feedAlert = $("#feedAlert");

//funcao que faz a inserção no Banco do FIREBASE
function salvar() {
    let usuario = document.getElementById("usuario").value;
    let mensagem = document.getElementById("mensagem").value;
    var datahora = document.getElementById("datahora").value;

    if (usuario != "" && mensagem != "" && datahora != "") {
        let texto = {//JSON
            "usuario": usuario,
            "mensagem": mensagem,
            "datahora": datahora
        };
        try {
            var content = {};
            content['/chat/' + usuario] = texto;
            retorno = firebase.database().ref().update(content);
            mostraFeed('success', 'usuario adicionada!');
            return retorno;
        } catch (error) {
            mostraFeed('error', 'Erro ao adicionar usuario!');
        }
    }
}

//funcao que faz a exclusao no Banco do FIREBASE
function remover(nomeusuario) {
    let texto = {//JSON
        "usuario": usuario,
        "mensagem": mensagem,
        "datahora": datahora
    };
    try {
        var content = {};
        content['/chat/' + nomeusuario] = {};
        retorno = firebase.database().ref().update(content);
        mostraFeed('success', 'usuario foi removida!');
        return retorno;
    } catch (error) {
        mostraFeed('error', 'Erro ao remover usuario!');
    }
}

//funcao que faz a alteracao no Banco do FIREBASE
function update(nomeAlterado) {
    var usuario = $('#usuario').val();
    var mensagem = $('#mensagem').val();
    var datahora = $('#datahora').val();

    if (usuario != "" && mensagem != "" && datahora != "") {
        let texto = {//JSON
            "usuario": usuario,
            "mensagem": mensagem,
            "datahora": datahora
        };
        try {
            var content = {};
            content['/chat/' + nomeAlterado] = {};
            content['/chat/' + usuario] = texto;
            retorno = firebase.database().ref().update(content);
            mostraFeed('success', 'usuario foi alterada!');
            return retorno;
        } catch (error) {
            mostraFeed('error', 'Erro ao alterar usuario!');
        }
    }
}

// indo para o top
function goToTop() {
    $('html, body, ion-content').animate({ scrollTop: 0 }, 'slow');
};

//setar o focus no input chat
function setFocususuario() {
    setTimeout(function () {
        $("#usuario").focus();
    }, 500)
};

//Funcao para mostras os feeds de status da inserção no BD
function mostraFeed(tipo_alert, msg_show) {
    var novaMsg = document.createElement('strong');
    novaMsg.textContent = msg_show;

    var msgSuccess = $(document).find('#msgSuccess');
    var msgError = $(document).find('#msgError');
    var msgAlert = $(document).find('#msgAlert');
    if (msgSuccess) { msgSuccess.remove(); };
    if (msgError) { msgError.remove(); };
    if (msgAlert) { msgAlert.remove(); };

    switch (tipo_alert) {
        case 'success':
            novaMsg.id = 'msgSuccess';
            feedSuccess.append(novaMsg);
            feedSuccess.show(300);
            setTimeout(function () { feedSuccess.hide(1000); }, 2000);
            break
        case 'error':
            novaMsg.id = 'msgError';
            feedError.append(novaMsg);
            feedError.show(300);
            setTimeout(function () { feedError.hide(1000); }, 2000);
            break
        case 'alert':
            novaMsg.id = 'msgAlert';
            feedAlert.append(novaMsg);
            feedAlert.show(300);
            setTimeout(function () { feedAlert.hide(1000); }, 2000);
            break
    }
}

function mostrarCrudusuario() {
    setFocususuario();
    $('#btnNovausuario').hide();
    $('#crudForm').show(300);
}

function esconderCrudusuario() {
    $('#crudForm').hide(300);
    $('#btnNovausuario').show();
}