import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function Status() {
  return (
    <>
      <main>
        <h1>Status do site</h1>
        <UpdatedAt />
        <DatabaseStatus />
      </main>
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  let updatedAtValue = "Carregando...";

  if (!isLoading && data) {
    updatedAtValue = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <>
      <p>Última atualização: {updatedAtValue} </p>
    </>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  let databaseStatusInfo = "Carregando...";

  if (!isLoading && data) {
    const { database } = data.dependencies;
    databaseStatusInfo = (
      <>
        <p>Conexões disponíveis: {database.max_connections}</p>
        <p>Conexões abertas: {database.opened_connections}</p>
        <p>
          Versão do PostgreSQL: <span class="badge">{database.version}</span>
        </p>
      </>
    );
  }

  return (
    <>
      <h2>Banco de dados</h2>
      {databaseStatusInfo}
    </>
  );
}
