export interface AdoWorkItem {
    id: string;
    type: 'Bug' | 'Product Backlog Item' | 'Task';
    title: string;
    url: string;
    description: string;
  }
  
  export const getWorkItemDetails = (id: string): Promise<AdoWorkItem> => {
    console.log(`Simulando fetch da API do ADO para o item: ${id}`);
    
    const mockItem: AdoWorkItem = {
      id: id,
      type: "Product Backlog Item",
      title: "Como utilizador, quero poder votar num item para que a equipa saiba o esforço",
      url: `https://dev.azure.com/seu-org/seu-projeto/_workitems/edit/${id}`,
      description: "Esta é a descrição do PBI <strong>12345</strong>. Devemos detalhar os critérios de aceitação aqui."
    };
  
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockItem);
      }, 1000);
    });
  };