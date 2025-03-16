import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();
    const databaseVersionResult = await database.query("SHOW server_version;");
    const databaseMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const databaseName = process.env.POSTGRES_DB;
    const databaseOpenedConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
      values: [databaseName],
    });
    const databaseValues = {
      version: databaseVersionResult.rows[0].server_version,
      max_connections: parseInt(
        databaseMaxConnectionsResult.rows[0].max_connections,
      ),
      opened_connections: databaseOpenedConnectionsResult.rows[0].count,
    };

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: databaseValues,
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.log("\n Erro do cath do controller:");
    console.error(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}

export default status;
