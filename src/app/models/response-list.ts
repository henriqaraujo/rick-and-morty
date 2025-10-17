export interface ResponseList<T>{
  /**
   * Dados da paginação
   */
  info: {
    /**
     * Total de registros
     */
    count: number;

    /**
     * Quantidade de paginas
     */
    pages: number;

    /**
     * Url da proxima página.
     * Caso seja a ultima pagina o valor será null
     */
      next: string | null;

      /**
       * Url a página anterior.
       */
      prev: string | null;
    };

    /**
     * Lista de objetos da consulta.
     */
    results: T[];
}
