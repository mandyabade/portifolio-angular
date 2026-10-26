import Cabecalho from './Cabecalho';
import CardProjeto from './CardProjeto';
import Rodape from './Rodape';

function App() {
  const projetos = [
    {
      nome: 'Portfólio Angular',
      descricao: 'Meu portfólio com Angular e Angular Material.',
      tecnologias: 'Angular, TypeScript',
      link_github: 'https://github.com/mandyabade/2026-DWII-portfolio-angular',
      ano: 2026
    },
    {
      nome: 'API do Portfólio em PHP',
      descricao: 'Endpoints de projetos e catálogo com PDO e MariaDB.',
      tecnologias: 'PHP, MariaDB',
      link_github: null,
      ano: 2026
    },
    {
      nome: 'Sistema de cadastro v1',
      descricao: 'CRUD em PHP do 1º trimestre.',
      tecnologias: 'PHP, MariaDB, Bootstrap',
      link_github: null,
      ano: 2026
    }
  ];

  return (
    <>
      <Cabecalho />
      <main>
        <h2>Projetos</h2>

        <div className="cards">
          {projetos.map((projeto, index) => (
            <CardProjeto key={index} projeto={projeto} />
          ))}
        </div>
      </main>
      <Rodape />
    </>
  );
}

export default App;