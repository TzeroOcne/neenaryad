<script lang="ts">
  import { dbFind, dbWrite } from '$lib/database';
  import { dbStore } from '$lib/store/layout';
  import type { CollectionName, Category as EntryType, Validation } from '@types';
  import { Alert, Button, Helper, Input, Label, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { Icon } from 'flowbite-svelte-icons';
  const collectionName:CollectionName = 'category';
  let formModal = false;
  let errorMessage = '';
  let entryList:EntryType[] = [];

  const refreshList = async () => {
    if ($dbStore) {
      entryList = await dbFind(collectionName);
    }
  };

  const targetEntry:EntryType = {
    id: '',
    label: '',
  };
  const validation:Validation<EntryType> = {
    id: {
      init: false,
      message: '',
    },
  };
  $: if (formModal) {
    if (validation.id.init) {
      if (targetEntry.id === '') {
        validation.id.message = 'ID cannot be empty';
      } else {
        validation.id.message = '';
      }
    }
    if (targetEntry.id !== '') {
      validation.id.init = true;
    }
  }
  const isValid = () => {
    let valid = true;
    if (targetEntry.id === '') {
      valid = false;
      validation.id.message = 'ID cannot be empty';
    }
    return valid;
  };
  
  const resetEntry = () => {
    targetEntry.key = '';
    targetEntry.id = '';
    targetEntry.label = '';
  };
  const resetValidation = () => {
    validation.id.message = '';
    validation.id.init = false;
  };
  
  const insertEntry = async (e:SubmitEvent|MouseEvent) => {
    e.preventDefault();
    if (!isValid()) {
      errorMessage = 'Input is invalid';
      return;
    }
    try {
      await dbWrite(collectionName, targetEntry);
      resetEntry();
      formModal = false;
      errorMessage = '';
      refreshList();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        errorMessage = error.message;
      }
    }
  };
  
  const onCloseForm = () => {
    errorMessage = '';
    resetValidation();
  };
  
  // eslint-disable-next-line no-undef
  const onEdit = (key?:IDBValidKey) => async () => {
    if (key) {
      return key;
    }
  };

  $: if ($dbStore) refreshList();
</script>

<Button class="p-0 m-0 bg-nnry-900 self-end w-8 h-8"
  on:click={() => formModal = true}
>
  <Icon name="plus-solid"/>
</Button>

<Table striped={true} class="mt-8">
  <colgroup>
    <col class="w-1/4">
    <col class="w-2/3">
    <col class="w-1/12">
  </colgroup>
  <TableHead class="dark:bg-nnrygray-700 text-white">
    <TableHeadCell>
      ID
    </TableHeadCell>
    <TableHeadCell>
      Label
    </TableHeadCell>
    <TableHeadCell />
  </TableHead>
  <TableBody>
    {#each entryList as { key, id, label } }
    <TableBodyRow class="odd:dark:bg-nnrygray-400 even:dark:bg-nnrygray-500">
      <TableBodyCell>
        {id}
      </TableBodyCell>
      <TableBodyCell>
        {label}
      </TableBodyCell>
      <TableBodyCell>
        <Button class="bg-nnry-900 p-0 m-0 w-12 h-12"
          on:click={onEdit(key)}
        >
          <Icon name="file-edit-solid" />
        </Button>
      </TableBodyCell>
    </TableBodyRow>
    {/each}
  </TableBody>
</Table>

<Modal bind:open={formModal} size="xs" autoclose={false}
  class="w-full dark:bg-nnrygray-600 text-white"
  on:hide={onCloseForm}
>
  <h3>
    Add Category
  </h3>
  <form action="#" on:submit={insertEntry} class="space-y-4">
    <Label class="space-y-2">
      <span>ID</span>
      <Input type="text" name="id" placeholder="id"
        bind:value={targetEntry.id}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.id.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Label</span>
      <Input type="text" name="label" placeholder="label"
        bind:value={targetEntry.label}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
    </Label>
    <Button class="bg-nnrygray-700" type="submit"
      on:click={insertEntry}
    >
      Insert
    </Button>
  </form>
  {#if errorMessage !== ''}
  <Alert class="dark:bg-nnrygray-700 text-red-500 font-bold flex">
    <Icon name="exclamation-circle-solid" />
    {errorMessage}
  </Alert>
  {/if}
</Modal>

<style lang="postcss">
  span {
    @apply text-white;
  }
</style>
