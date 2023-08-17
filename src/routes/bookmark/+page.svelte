<script lang="ts">
  import { dbFind, dbFindByKey, dbFindByKeyAndUpdate, dbWrite } from '$lib/database';
  import { dbStore } from '$lib/store/layout';
  import type { CollectionName, Bookmark as EntryType, Validation } from '@types';
  import { Alert, Button, Helper, Input, Label, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { Icon } from 'flowbite-svelte-icons';
  const collectionName:CollectionName = 'bookmark';
  let insertModal = false;
  let editModal = false;
  let errorMessage = '';
  let entryList:EntryType[] = [];

  const refreshList = async () => {
    if ($dbStore) {
      entryList = await dbFind(collectionName);
    }
  };

  const targetEntry:EntryType = {
    title: '',
    titleLink: '',
    chapter: '',
    chapterLink: '',
    group: '',
    groupLink: '',
  };
  const validation:Validation<EntryType> = {
    chapter: {
      init: false,
      message: '',
    },
    chapterLink: {
      init: false,
      message: '',
    },
    group: {
      init: false,
      message: '',
    },
    groupLink: {
      init: false,
      message : '',
    },
    title: {
      init: false,
      message: '',
    },
    titleLink: {
      init: false,
      message: '',
    },
  };

  $: if (insertModal) {
    if (validation.title.init) {
      if (targetEntry.title === '') {
        validation.title.message = 'Title cannot be empty';
      } else {
        validation.title.message = '';
      }
    }
    if (targetEntry.title) {
      validation.title.init = true;
    }
    if (validation.titleLink.init) {
      if (targetEntry.titleLink === '') {
        validation.titleLink.message = 'Title link cannot be empty';
      } else {
        validation.titleLink.message = '';
      }
    }
    if (targetEntry.titleLink !== '') {
      validation.titleLink.init = true;
    }
    if (validation.chapter.init) {
      if (targetEntry.chapter === '') {
        validation.chapter.message = 'Chapter cannot be empty';
      } else {
        validation.chapter.message = '';
      }
    }
    if (targetEntry.chapter) {
      validation.chapter.init = true;
    }
    if (validation.chapterLink.init) {
      if (targetEntry.chapterLink === '') {
        validation.chapterLink.message = 'Chapter link cannot be empty';
      } else {
        validation.chapterLink.message = '';
      }
    }
    if (targetEntry.chapterLink) {
      validation.chapterLink.init = true;
    }
    if (validation.group.init) {
      if (targetEntry.group === '') {
        validation.group.message = 'Group cannot be empty';
      } else {
        validation.group.message = '';
      }
    }
    if (targetEntry.group) {
      validation.group.init = true;
    }
    if (validation.groupLink.init) {
      if (targetEntry.groupLink === '') {
        validation.groupLink.message = 'Group link cannot be empty';
      } else {
        validation.groupLink.message = '';
      }
    }
    if (targetEntry.groupLink) {
      validation.groupLink.init = true;
    }
  }

  const isValid = () => {
    let valid = true;
    if (targetEntry.title === '') {
      valid = false;
      validation.title.message = 'Title cannot be empty';
    }
    if (targetEntry.titleLink === '') {
      valid = false;
      validation.titleLink.message = 'Title link cannot be empty';
    }
    if (targetEntry.chapter === '') {
      valid = false;
      validation.chapter.message = 'Chapter cannot be empty';
    }
    if (targetEntry.chapterLink === '') {
      valid = false;
      validation.chapterLink.message = 'Chapter link cannot be empty';
    }
    if (targetEntry.group === '') {
      valid = false;
      validation.group.message = 'Group cannot be empty';
    }
    if (targetEntry.groupLink === '') {
      valid = false;
      validation.groupLink.message = 'Group link cannot be empty';
    }
    return valid;
  };
  
  const resetEntry = () => {
    targetEntry.title = '';
    targetEntry.titleLink = '';
    targetEntry.chapter = '';
    targetEntry.chapterLink = '';
    targetEntry.group = '';
    targetEntry.groupLink = '';
  };
  const resetValidation = () => {
    validation.title.message = '';
    validation.title.init = false;
    validation.titleLink.message = '';
    validation.titleLink.init = false;
    validation.chapter.message = '';
    validation.chapter.init = false;
    validation.chapterLink.message = '';
    validation.chapterLink.init = false;
    validation.group.message = '';
    validation.group.init = false;
    validation.groupLink.message = '';
    validation.groupLink.init = false;
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
      insertModal = false;
      errorMessage = '';
      refreshList();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        errorMessage = error.message;
      }
    }
  };
  
  const updateEntry = async (e:SubmitEvent|MouseEvent) => {
    e.preventDefault();
    if (!isValid()) {
      errorMessage = 'Input is invalid';
      return;
    }
    try {
      if (!targetEntry.key) throw new Error('key is undefined');
      await dbFindByKeyAndUpdate(collectionName, targetEntry.key, targetEntry);
      resetEntry();
      editModal = false;
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
      const result = await dbFindByKey(collectionName, key);
      targetEntry.key = key;
      targetEntry.title = result.title;
      targetEntry.titleLink = result.titleLink;
      targetEntry.chapter = result.chapter;
      targetEntry.chapterLink = result.chapterLink;
      targetEntry.group = result.group;
      targetEntry.groupLink = result.groupLink;
      editModal = true;
    }
  };
  
  const onCloseEdit = () => {
    onCloseForm();
    resetEntry();
  };

  $: if ($dbStore) refreshList();
</script>

<Button class="p-0 m-0 bg-nnry-900 self-end w-8 h-8"
  on:click={() => insertModal = true}
>
  <Icon name="plus-solid"/>
</Button>

<Table id="entry-table-root" striped={true} class="mt-8">
  <colgroup>
    <col class="w-1/12">
    <col class="w-1/4">
    <col class="w-1/6">
    <col class="w-1/12">
    <col class="w-1/6">
    <col class="w-1/12">
    <col class="w-1/12">
  </colgroup>
  <TableHead class="dark:bg-nnrygray-700 text-white">
    <TableBodyCell />
    <TableHeadCell>
      Title
    </TableHeadCell>
    <TableHeadCell>
      Chapter
    </TableHeadCell>
    <TableBodyCell />
    <TableHeadCell>
      Group
    </TableHeadCell>
    <TableBodyCell />
    <TableBodyCell />
  </TableHead>
  <TableBody>
    {#each entryList as {
      key,
      title, titleLink,
      chapter, chapterLink,
      group, groupLink,
    }}
    <TableBodyRow class="odd:dark:bg-nnrygray-400 even:dark:bg-nnrygray-500">
      <TableBodyCell class="text-right">
        <Button href={titleLink} class="bg-nnry-900 p-0 m-0 w-12 h-12">
          <Icon name="book-solid" />
        </Button>
      </TableBodyCell>
      <TableBodyCell>
        {title}
      </TableBodyCell>
      <TableBodyCell class="w-1/6">
        {chapter}
      </TableBodyCell>
      <TableBodyCell>
        <Button href={chapterLink} class="bg-nnry-900 p-0 m-0 w-12 h-12">
          <Icon name="bookmark-solid" />
        </Button>
      </TableBodyCell>
      <TableBodyCell>
        {group}
      </TableBodyCell>
      <TableBodyCell>
        <Button href={groupLink} class="bg-nnry-900 p-0 m-0 w-12 h-12">
          <Icon name="user-group-solid" />
        </Button>
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

<Modal id="insert-modal-root" bind:open={insertModal} size="xs" autoclose={false}
  class="w-full dark:bg-nnrygray-600 text-white"
  on:hide={onCloseForm}
>
  <h3>
    Add Bookmark
  </h3>
  <form action="#" on:submit={insertEntry} class="space-y-4">
    <Label class="space-y-2">
      <span>Title</span>
      <Input type="text" name="key" placeholder="key"
        bind:value={targetEntry.title}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.title.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Title Link</span>
      <Input type="text" name="label" placeholder="label"
        bind:value={targetEntry.titleLink}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.titleLink.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Chapter</span>
      <Input type="text" name="key" placeholder="key"
        bind:value={targetEntry.chapter}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.chapter.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Chapter Link</span>
      <Input type="text" name="label" placeholder="label"
        bind:value={targetEntry.chapterLink}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.chapterLink.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Group</span>
      <Input type="text" name="key" placeholder="key"
        bind:value={targetEntry.group}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.group.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Group Link</span>
      <Input type="text" name="label" placeholder="label"
        bind:value={targetEntry.groupLink}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.groupLink.message}
      </Helper>
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

<Modal id="edit-modal-root" bind:open={editModal} size="xs" autoclose={false}
  class="w-full dark:bg-nnrygray-600 text-white"
  on:hide={onCloseEdit}
>
  <h3>Edit Bookmark</h3>
  <form action="#" on:submit={insertEntry} class="space-y-4">
    <Label class="space-y-2">
      <span>Title</span>
      <Input type="text" name="key" placeholder="key"
        bind:value={targetEntry.title}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.title.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Title Link</span>
      <Input type="text" name="label" placeholder="label"
        bind:value={targetEntry.titleLink}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.titleLink.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Chapter</span>
      <Input type="text" name="key" placeholder="key"
        bind:value={targetEntry.chapter}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.chapter.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Chapter Link</span>
      <Input type="text" name="label" placeholder="label"
        bind:value={targetEntry.chapterLink}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.chapterLink.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Group</span>
      <Input type="text" name="key" placeholder="key"
        bind:value={targetEntry.group}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.group.message}
      </Helper>
    </Label>
    <Label class="space-y-2">
      <span>Group Link</span>
      <Input type="text" name="label" placeholder="label"
        bind:value={targetEntry.groupLink}
        class="dark:bg-nnrygray-400 text-white placeholder:text-gray-500"
      />
      <Helper color="red" class="font-bold">
        {validation.groupLink.message}
      </Helper>
    </Label>
    <Button class="bg-nnrygray-700" type="submit"
      on:click={updateEntry}
    >
      Update
    </Button>
  </form>
</Modal>

<style lang="postcss">
  span {
    @apply text-white;
  }
</style>
