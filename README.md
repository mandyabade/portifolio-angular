# Meu Portfólio Angular
Projeto desenvolvido para praticar Angular e criar um portfólio pessoal.

## Tecnologias
- Angular
- HTML
- CSS

## Ambiente
Node.js: v20.x.x
npm: v10.x.x
Angular CLI: v19.x.x

## Como executar
npm install
ng serve

## Aula 16 - 08/06/2026
# Funcionalidades adicionadas
- Barra de navegação
- Página Home
- Página Sobre

Acesse http://localhost:4200

## Aula 17 - 15/06/2026
# Funcionalidades adicionadas
- Conexão com o banco de dados MariaDB
- Criação de API's

## Como executar
- Acesse /usr/bin/php -S localhost:8000
- Adicione na URL api/nome_do_arquivo
- Para a página detalhes: após o adicional da URL, adicione o id, desse modo: api/detalhes.php?id=n°

## Aula 18 - 10/08/2026
# Funcionalidades adicionadas
- Criação da página contatos, com formulário 

## Autoavaliação

## 🎯 Autoavaliação

*Conceito pretendido: A*

### Justificativa

## 🎯 Autoavaliação

**Conceito pretendido: A**

### Justificativa

- **Form reativo + erro por campo:**  
  Em `src/app/contato/contato.ts`, linhas 15 e 22–26, o formulário é criado com `FormBuilder` e utiliza `Validators.required`, `Validators.email` e `Validators.minLength`.  
  Em `src/app/contato/contato.html`, linhas 7–9, 13–15 e 19–21, são exibidas mensagens específicas de erro somente quando o campo está inválido e foi tocado (`invalid && touched`).  
  Em `src/app/contato/contato.ts`, linhas 32–40, o formulário é marcado como tocado e o foco é direcionado ao primeiro campo inválido.

- **POST via service + tratamento:**  
  Em `src/app/contato.service.ts`, linhas 12–18, o `HttpClient` realiza o envio dos dados através de `http.post()`.  
  Em `src/app/contato/contato.ts`, linhas 45–49, a resposta de sucesso é tratada pelo callback `next`, enquanto nas linhas 50-60 o callback `error` trata as falhas da requisição.

- **Endpoint PHP (`php://input`, validação, prepared, 201/400):**  
  Em `api/contato.php`, linha 15, os dados são recebidos através de `php://input`.  
  Nas linhas 17–19, os campos recebidos são tratados.  
  Nas linhas 21–25, são realizadas as validações de nome, e-mail e mensagem.  
  Nas linhas 27–31, quando existem erros de validação, o endpoint retorna HTTP **400** e envia o array `erros`.  
  Nas linhas 34–37, é utilizada uma consulta preparada com PDO através de `prepare()` e `execute()` para inserir os dados no banco.  
  Nas linhas 39–44, após o cadastro realizado com sucesso, o endpoint retorna HTTP **201** e uma mensagem de confirmação.

- **Estados, robustez e UX (DUA):**  
  Em `src/app/contato/contato.ts`, linhas 18–20, são definidos os estados `enviando`, `sucesso` e `erro`.  
  Na linha 42, o estado `enviando` é ativado durante o envio.  
  Em `src/app/contato/contato.html`, linhas 23–25, o botão apresenta o texto `Enviando...` e fica desabilitado enquanto o formulário estiver inválido ou durante o envio.  
  Em `src/app/contato/contato.ts`, linhas 45–49, após o sucesso o formulário é resetado e o estado de envio é finalizado.  
  Nas linhas 50–60, os erros retornados pelo backend são aproveitados através de `err.error?.erros` e o botão é reabilitado após o erro.  
  Em `src/app/contato/contato.html`, as linhas 4–5, 11–12 e 17–18 utilizam `label` associado aos campos através de `for`/`id`. As linhas 5, 12 e 18 utilizam `aria-invalid` para indicar o estado de validação dos campos. As mensagens de erro também utilizam o símbolo `⚠`, evitando que a cor seja o único sinal de erro.

- **Autoavaliação:**  
  Considerando os critérios implementados no formulário Angular, no serviço responsável pelo envio dos dados e no endpoint PHP, considero que o projeto atende ao conceito **A**.
