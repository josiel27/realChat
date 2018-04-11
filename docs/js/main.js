//referencia do banco de dados firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBWpUQ7MGjCFkT3tFv1mLBU0PKxaC1V0jA",
    authDomain: "realchat-493cf.firebaseapp.com",
    databaseURL: "https://realchat-493cf.firebaseio.com",
    projectId: "realchat-493cf",
    storageBucket: "realchat-493cf.appspot.com",
    messagingSenderId: "199166590696"
};
firebase.initializeApp(config);

let feedSuccess = $("#feedSuccess");
let feedError = $("#feedError");
let feedAlert = $("#feedAlert");

//funcao que faz a inserção no Banco do FIREBASE
function salvar(usuario) {
    // let usuario = document.getElementById("usuario").value;
    let mensagem = document.getElementById("mensagem").value;
    var datahora = new Date().getTime();

    if (usuario != "" && mensagem != "") {
        let texto = {//JSON
            "usuario": usuario,
            "mensagem": mensagem,
            "datahora": datahora
        };
        try {
            var content = {};
            content['/chat/' + datahora] = texto;
            retorno = firebase.database().ref().update(content);
            mostraFeed('success', 'usuario adicionada!');
            return retorno;
        } catch (error) {
            mostraFeed('error', 'Erro ao adicionar usuario!');
        }
    }
}

//funcao que faz a inserção no Banco do FIREBASE
function salvarFirebase() {
    var txtNewUser = $('#txtNewUser').val();
    var txtNewPass = $('#txtNewPass').val();

    if (txtNewUser != "" && txtNewPass != "") {
        let texto = {//JSON
            "usuario": txtNewUser,
            "senha": txtNewPass,
        };
        try {
            var content = {};
            content['/acesso/' + txtNewUser] = texto;
            retorno = firebase.database().ref();
            retorno.update(content);
            mostraFeed('success', 'Usuario adicionado!');
            document.getElementById('txtNewUser').value = "";//apaga o campo de texto
            document.getElementById('txtNewPass').value = "";//apaga o campo de texto
            goToLogin(); // volta para a tela de login
            return retorno;
        } catch (error) {
            mostraFeed('error', 'Erro ao adicionar usuario!');
        }
    }
}

//antes de salvar faz o teste se o usuario já existe no sistema
salvarNovoUsuario = () => {
    var txtNewUser = $('#txtNewUser').val();
    var textRef = firebase.database().ref('acesso');
    var value = "";
    var usuarioExistente = false;
    textRef.once('value', function (snapshot) {
        contador = snapshot.numChildren();
        snapshot.forEach(function (childSnapshot) {
            value = childSnapshot.val();
            if (value.usuario == txtNewUser) {
                usuarioExistente = true;
            }
        });
        if (!usuarioExistente) {
            salvarFirebase();
        } else {
            mostraFeed('error', 'Usuário existente!');
            document.getElementById('txtNewPass').value = "";//apaga o campo de texto
        }
    })
}

//vai para tela de login
goToLogin = () => {
    $('#formRegister').hide();
    $('#formLogin').show();
    document.getElementById('txtAcessoUser').value = "";//apaga o campo de texto
    document.getElementById('txtAcessoPass').value = "";//apaga o campo de texto
}

//troca o formulario de login pelo o de chat
function acessar() {
    $('#formLogin').hide();
    $('#formChat').show();
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

// indo para o top
function goToTop() {
    
};
//indo para o final da tabela(chat)
function goToDown() {
    setTimeout(function () {
        location.href = "#ancoraBot";
    }, 500)
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