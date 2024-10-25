import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionNavComponent } from '@components/accordion-nav/accordion-nav.component';
import { AddItemModalComponent } from '@components/add-item-modal/add-item-modal.component';
import { AgendaLoadingComponent } from '@components/agenda-loading/agenda-loading.component';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { DynamicTableComponent } from '@components/dynamic-table/dynamic-table.component';
import { EventDescriptionComponent } from '@components/event-description/event-description.component';
import { EventToolbarComponent } from '@components/event-toolbar/event-toolbar.component';
import { EventsToolbar } from '@models/event-toolbar.model';
import { EventNode, EventTime, NodeAlertMessage } from '@models/nodes.model';
import { StoreState } from '@models/store.model';
import { Store } from '@ngrx/store';
import { NodeService } from '@services/node/node.service';
import { environment } from '../../../environments/environment';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectUserToken } from '../../store/auth/auth.selectors';
import { HistoricalDialogComponent } from '@components/historical-dialog/historical-dialog.component';
import { RemoveItemModalComponent } from '@components/remove-item-modal/remove-item-modal.component';
import { SelectAction } from '@models/dynamic-table.model';
import { Language } from '@models/language.model';
import { selectSelectedLanguage } from '../../store/language/language.selectors';
import { selectSelectedNode } from '../../store/nodes/nodes.selectors';
import { setNodes, setSelectedNode } from '../../store/nodes/nodes.actions';
import { TypographyComponent } from '@components/typography/typography.component';
import { BaseEmptyStateComponent } from '../../components/base-empty-state/base-empty-state.component';
import { PublishItemModalComponent } from '@components/publish-item-modal/publish-item-modal.component';
import { PublicationStatus } from '@models/parametricsLocation.model';
import { SnackBarService } from '@services/snack-bar/snack-bar.service';
import { DialogService } from '@services/dialog/dialog.service';
import { DialogComponent } from '@components/dialog/dialog.component';
import {
  areAllParentItemsPublished,
  findNodeById,
  flattenEvent,
  payloadEditItems,
  updateEventNode,
} from '@utils/event';
import { validateOnRowMovement } from '@utils/time-rules/row-movement-validation';
import { closeAlertMessageTime } from '../../../constants';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    AccordionNavComponent,
    AgendaLoadingComponent,
    BaseEmptyStateComponent,
    BreadcrumbComponent,
    CommonModule,
    DynamicTableComponent,
    EventDescriptionComponent,
    EventToolbarComponent,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatIconModule,
    TypographyComponent,
  ],
  providers: [NodeService],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css',
})
export class AgendaComponent implements OnDestroy {
  config = environment;
  dialogSystem = inject(MatDialog);
  nodeService = inject(NodeService);
  store = inject(Store<StoreState>);
  private snackBarService = inject(SnackBarService);
  private dialogService = inject(DialogService);

  isLoading = true;
  selectedNode?: EventNode;
  selectedChildrens?: EventNode[] = [];
  breadcrumb: EventNode[] = [];
  eventNode: EventNode[] = [];
  displayColumns: string[] = [
    'expand',
    'checkbox',
    'location',
    'localtimeRange',
    'name',
    'itemLevel',
    'document',
    'publicationStatus',
    'translationStatus',
    'actions',
  ];
  toolbarNodes: EventsToolbar[] = [
    {
      id: 'add-items',
      name: 'Add Items',
      icon: 'add_circle_outline',
      disabled: true,
    },
    {
      id: 'add-historical',
      name: 'Historical Items',
      icon: 'history',
    },
    {
      id: 'publish',
      name: 'Publish',
      icon: 'upload',
      style: 'icon-green',
      disabled: true,
    },
    {
      id: 'remove-item',
      name: 'Remove',
      icon: 'delete_outline',
      style: 'icon-red',
    },
  ];

  idToken = '';
  token$: Observable<string>;
  selectedLanguage: Language = { code: 'en', name: 'English' };

  onDestroy$ = new Subject<void>();

  messages = {
    successSave: {
      message: 'The items were saved successfully',
      img: 'images/check_circle_outline.svg',
    },
    error: {
      message: 'There was an error saved chenges for the agenda. <br /> Please try again later.',
      img: 'images/error_outline.svg',
    },
    successUnpublish: {
      message: 'The item were unpublish successfully.',
      img: 'images/check_circle_outline.svg',
    },
  };

  enableSaveChanges = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.token$ = this.store.select(selectUserToken);

    this.token$.pipe(takeUntil(this.onDestroy$)).subscribe((_token: string) => {
      this.idToken = _token ?? '';
    });

    this.store
      .select(selectSelectedLanguage)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((selectedLanguage: Language) => {
        this.isLoading = true;
        this.selectedLanguage = selectedLanguage;
        this.getNodes();
      });

    this.store
      .select(selectSelectedNode)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((_selectedNode: EventNode | undefined) => {
        this.selectedNode = _selectedNode;
        this.updateToolbar();
      });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    if (window.location.pathname.includes('/agendas/home')) {
      this.configureSelectedSubEvent();
    }
  }

  private getNodes() {
    this.isLoading = true;
    this.selectedChildrens = [];
    this.nodeService
      .getNodes(this.idToken, this.selectedLanguage.code)
      .then((nodes: EventNode[]) => {
        this.isLoading = false;
        this.store.dispatch(setNodes({ nodes }));

        if (nodes.length > 0) {
          this.configAgendaData(nodes);
        }else {
         this.router.navigate(['/404']);
        }
      })
      .catch((err: unknown) => {
        this.isLoading = false;
        console.error(err);
        this.router.navigate(['/system-error']);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(undefined);
    this.onDestroy$.complete();
  }

  private configAgendaData(data: EventNode[]) {
    this.eventNode = data;
    this.isLoading = false;
    const agendaId = +(this.route.snapshot.paramMap.get('itemId') ?? 0);
    const event = findNodeById(data, agendaId)!;

    this.store.dispatch(setSelectedNode({ node: event }));

    const parentEvent = this.findParentEventById(data, agendaId);

    this.breadcrumb = parentEvent !== null ? [parentEvent, event] : [event];
  }

  private findParentEventById(nodes: EventNode[], id: number, parentNode: EventNode | null = null): EventNode | null {
    // find the parent event that contains the id
    for (const event of nodes) {
      if (event.id === id) {
        return parentNode;
      }
      if (event.nodes && event.nodes.length > 0) {
        const found = this.findParentEventById(event.nodes, id, event);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  tableNavigation(event: EventNode) {
    this.breadcrumb.push(event);
  }

  onNavigateTo(event: EventNode) {
    const idx = this.breadcrumb.findIndex((breadcrumb) => breadcrumb.id === event.id);
    if (idx <= 0) {
      this.router.navigate(['home']);
      this.configureSelectedSubEvent();
    } else {
      this.router.navigate(['agenda', this.breadcrumb[idx - 1].id]);
    }
  }

  private configureSelectedSubEvent() {
    const eventId = +(this.route.snapshot.paramMap.get('eventId') ?? 0);
    const event = findNodeById(this.eventNode, eventId) ?? undefined;
    this.store.dispatch(setSelectedNode({ node: event }));
  }

  onSelectOption(event: EventsToolbar) {
    if (event.id === 'add-items') {
      this.dialogSystem
        .open(AddItemModalComponent, {
          data: {
            node:
              this.selectedChildrens !== undefined && this.selectedChildrens.length > 0
                ? { ...this.selectedChildrens[0], action: 'create' }
                : { ...this.selectedNode, singleSelection: true, action: 'create' },
            parent: this.selectedNode,
            preloadData: {},
          },
          minWidth: 1200,
        })
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((isSaved: boolean) => {
          if (isSaved) {
            this.getNodes();
          }
        });
      return;
    }
    if (event.id === 'remove-item' && this.selectedChildrens && this.selectedChildrens.length > 0) {
      this.dialogSystem
        .open(RemoveItemModalComponent, {
          data: this.selectedChildrens,
          minWidth: 669,
        })
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((itemRemoved: boolean) => {
          if (itemRemoved) {
            this.onSelectMultiple([]);
            this.getNodes();
          }
        });
      return;
    }
    if (event.id === 'add-historical') {
      this.dialogSystem
        .open(HistoricalDialogComponent, {
          data:
            this.selectedChildrens !== undefined && this.selectedChildrens.length > 0
              ? this.selectedChildrens[0]
              : { ...this.selectedNode, singleSelection: true, parentId: this.selectedNode?.id },
          minWidth: 1200,
        })
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((isSaved: boolean) => {
          if (isSaved) {
            this.getNodes();
          }
        });
      return;
    }
    if (event.id === 'publish') {
      const nodesToPublish =
        this.selectedChildrens
          ?.filter((n) => n.publicationStatus?.id !== PublicationStatus.PUBLISHED)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ nodes: _, ...rest }) => {
            return {
              ...rest,
            };
          }) || [];
      if (nodesToPublish.length === 0) {
        const nodesToUnpublish =
          this.selectedChildrens?.filter((n) => n.publicationStatus?.id === PublicationStatus.PUBLISHED) || [];
        if (nodesToUnpublish!.length > 0) {
          const payload = payloadEditItems(nodesToUnpublish!);
          payload[0].itemPublicationStatusId = PublicationStatus.DRAFT;
          this.nodeService.updateNode(this.idToken, payload[0]).then(() => {
            this.snackBarService.open(this.messages.successUnpublish);
            this.getNodes();
          });
        }
        return;
      }

      const publishedItems = this.selectedNode?.nodes?.filter(
        (node) => node.publicationStatus?.id === PublicationStatus.PUBLISHED,
      );

      this.dialogSystem
        .open(PublishItemModalComponent, {
          data: {
            nodesToPublish: nodesToPublish,
            selectedAgenda: this.selectedNode,
            publishedNodes: publishedItems,
          },
          minWidth: 1200,
        })
        .afterClosed()
        .subscribe((response: boolean) => {
          if (response) {
            this.getNodes();
          }
        });
    }
  }

  onSelectMultiple(nodes: EventNode[]) {
    this.selectedChildrens = nodes;
    this.updateToolbar();
  }

  private updateToolbar() {
    if (this.selectedChildrens !== undefined) {
      if (this.selectedChildrens.length > 1) {
        this.toolbarNodes.forEach((event, idx) => {
          if (event.id === 'add-items' || event.id === 'add-historical') {
            this.toolbarNodes[idx].disabled = true;
          }
        });
      } else if (this.selectedChildrens.length === 1) {
        this.toolbarNodes.forEach((event, idx) => {
          if (event.id === 'add-items') {
            const selectedChildren = this.selectedChildrens![0];
            const nodes = selectedChildren.nodes ?? [];
            if (nodes.length === 0) {
              this.toolbarNodes[idx].disabled = selectedChildren.type === 'foot-note' || !selectedChildren.endDateUTC;
            } else {
              const lastItem = nodes[nodes.length - 1];
              this.toolbarNodes[idx].disabled = lastItem.endDateUTC ? false : true;
            }
          }
        });
      } else if (this.selectedChildrens.length === 0) {
        this.toolbarNodes.forEach((event, idx) => {
          if (event.id === 'add-items' || event.id === 'add-historical') {
            const nodes = this.selectedNode?.nodes ?? [];
            if (nodes.length === 0) {
              this.toolbarNodes[idx].disabled = false;
            } else {
              const lastItem = nodes[nodes.length - 1];
              this.toolbarNodes[idx].disabled = lastItem.endDateUTC ? false : true;
            }
          }
          if (event.id === 'remove-item' || event.id === 'publish') {
            this.toolbarNodes[idx].disabled = true;
          }
        });
      }
      if (this.selectedChildrens.length >= 1) {
        this.toolbarNodes.forEach((event, idx) => {
          if (event.id === 'publish') {
            if (!this.selectedChildrens?.some((n) => n.publicationStatus?.id === PublicationStatus.PUBLISHED)) {
              this.toolbarNodes[idx].name = 'Publish';
              this.toolbarNodes[idx].icon = 'upload';
              this.toolbarNodes[idx].disabled = !areAllParentItemsPublished(
                this.selectedChildrens ?? [],
                this.selectedNode?.nodes ?? [],
              );
            } else if (this.selectedChildrens.length === 1) {
              this.toolbarNodes[idx].name = 'Unpublish';
              this.toolbarNodes[idx].icon = 'download';
              this.toolbarNodes[idx].disabled = false;
            } else {
              this.toolbarNodes[idx].disabled = true;
            }
          }
          if (event.id === 'remove-item') {
            this.toolbarNodes[idx].disabled = false;
          }
        });
      }
    } else {
      this.toolbarNodes.forEach((event, idx) => {
        if (event.id === 'add-items' || event.id === 'add-historical') {
          this.toolbarNodes[idx].disabled = false;
        }
        if (event.id === 'remove-item') {
          this.toolbarNodes[idx].disabled = true;
        }
      });
    }
  }

  onSelectAction(item: SelectAction) {
    const event: EventNode = { ...item.event, isEdit: true };
    if (item.action === 'edit') {
      event.action = 'edit';
      event.mainEventId = +(this.route.snapshot.paramMap.get('eventId') ?? 0);

      this.dialogSystem
        .open(AddItemModalComponent, {
          data: {
            node: event,
            parent: this.selectedNode,
            preloadData: item.event,
            eventId: this.breadcrumb[0].id,
          },
          minWidth: 1200,
        })
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((isSaved: boolean) => {
          if (isSaved) {
            this.getNodes();
          }
        });
    } else if (item.action === 'copy') {
      event.isEdit = false;
      event.action = 'copy';
      this.dialogSystem
        .open(AddItemModalComponent, {
          data: {
            node: event,
            parent: this.selectedNode,
            preloadData: item.event,
          },
          minWidth: 1200,
        })
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((isSaved: boolean) => {
          if (isSaved) {
            this.getNodes();
          }
        });
    }
  }

  updateDataSourceNodes(nodes: EventNode[], data: { parent: EventNode; pos: number }) {
    if (!data.parent.id) {
      this.selectedNode = Object.assign({}, this.selectedNode, {
        nodes: [...nodes],
      });
    } else {
      data.parent = Object.assign({}, data.parent, {
        nodes: [...nodes],
      });
      const nodesResult = this.updateNodes(this.selectedNode!, data.parent.id, data.parent);
      this.selectedNode = Object.assign({}, this.selectedNode, {
        nodes: [...nodesResult!],
      });
    }
  }

  updateNodes(event: EventNode, id: number, itemUpdate: EventNode) {
    function findAndReplace(nodes: EventNode[]): EventNode[] {
      if (!Array.isArray(nodes) || nodes.length === 0) return nodes;
      return nodes.map((node) => {
        if (node.id === id) return itemUpdate;
        if (node.nodes && node.nodes.length > 0) return { ...node, nodes: findAndReplace(node.nodes) };
        return node;
      });
    }
    return findAndReplace(event.nodes!);
  }

  handleInputTimeChanges({ node, invalid, message }: EventTime) {
    if (invalid) {
      return this.dialogService.open(DialogComponent, message);
    }
    this.selectedNode = updateEventNode(this.selectedNode!, node);
    this.enableSaveChanges = true;
  }

  private open(messageType: NodeAlertMessage) {
    let message: { message: string; img: string };

    switch (messageType) {
      case NodeAlertMessage.successSave:
        message = this.messages.successSave;
        break;

      case NodeAlertMessage.error:
        message = this.messages.error;
        break;

      default:
        message = this.messages.error;
        break;
    }
    this.snackBarService.open(message);
  }

  saveChanges() {
    this.enableSaveChanges = false;
    const flatNodes = flattenEvent(this.selectedNode!, this.selectedNode!);
    const payload = payloadEditItems(flatNodes);
    this.nodeService
      .saveChangesAgenda(this.idToken, payload)
      .then(() => {
        this.getNodes();
        this.open(NodeAlertMessage.successSave);
      })
      .catch(() => {
        this.getNodes();
        this.open(NodeAlertMessage.error);
      });
  }

  onRowDown(data: { parent: EventNode; pos: number }) {
    const nodes: EventNode[] = [...data.parent.nodes!];
    if (data.pos < nodes.length - 1) {
      const index = data.pos;
      const currentEvent = { ...nodes[index] };
      const nextEvent = { ...nodes[index + 1] };

      // Swap the events
      const result = validateOnRowMovement(this.selectedNode!, currentEvent, nextEvent);
      if (result.invalid) {
        return this.dialogService.open(DialogComponent, closeAlertMessageTime);
      }

      [nodes[index + 1], nodes[index]] = [result.currentNode, result.adjacentEvent];

      this.updateDataSourceNodes(nodes, data);
      this.enableSaveChanges = true;
    }
  }

  onRowUp(data: { parent: EventNode; pos: number }) {
    const nodes: EventNode[] = [...data.parent.nodes!];

    if (data.pos > 0) {
      const index = data.pos;

      const currentEvent = { ...nodes[index] };
      const previousEvent = { ...nodes[index - 1] };

      const result = validateOnRowMovement(this.selectedNode!, currentEvent, previousEvent);
      if (result.invalid) {
        return this.dialogService.open(DialogComponent, closeAlertMessageTime);
      }

      [nodes[index - 1], nodes[index]] = [result.currentNode, result.adjacentEvent];

      this.updateDataSourceNodes(nodes, data);
      this.enableSaveChanges = true;
    }
  }
}
