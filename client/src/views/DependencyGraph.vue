<template>
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.X/css/materialdesignicons.min.css" rel="stylesheet">

    <Header></Header>
    <div class="graph_home">
        <div class="left">
            <SideMenu></SideMenu>
        </div>
        <div class="graph-right">
            <!-- Toolbar -->
            <div class="top-section">
            <div class="toolbar">

                <div class="toolbar_edges">
                    <v-label class="toolbar_nodes_label" style="margin-left: 0px;">Edges: </v-label>
                    <div>
                    <v-tooltip
                    v-if="selectedEdges.length == 0"
                        activator="parent"
                        location="bottom"
                    >
                    Select an edge to activate button
                    </v-tooltip>
                        <v-btn v-on:click="changeStatus" class="toolbar_btn" :disabled="selectedEdges.length == 0">
                            Change Status
                        </v-btn>
                    </div>
                    <div>
                        <v-tooltip
                            v-if="selectedEdges.length == 0"
                            activator="parent"
                            location="bottom"
                        >
                        Select an edge to activate button 
                        </v-tooltip>
                        <v-btn v-on:click="deleteDependency" class="toolbar_btn" :disabled="selectedEdges.length == 0">
                            Delete
                        </v-btn>
                    </div>

                    <div>
                        <v-tooltip
                            v-if="selectedNodes.length !== 2"
                            activator="parent"
                            location="bottom"
                        >
                        Select two nodes to activate button (shift + click)
                        </v-tooltip>
                    <v-btn v-on:click="addDependency" class="toolbar_btn" :disabled="selectedNodes.length !== 2" >
                        Add New
                    </v-btn>
                    </div>  

                </div>

                <div class="toolbar_nodes">
                    <v-label class="toolbar_nodes_label" style="margin-left: 20px;">Nodes: </v-label>
                    <v-btn v-on:click="addNode" class="toolbar_btn">
                        Add New
                    </v-btn>
                    <div> 
                    <v-tooltip
                        v-if="selectedNodes.length == 0"
                        activator="parent"
                        location="bottom"
                    >
                    Select at least one node to activate button
                    </v-tooltip>
                    <v-btn v-on:click="deleteNodesDialog" class="toolbar_btn" :disabled="selectedNodes.length == 0">
                        Delete
                    </v-btn>
                    </div>

                </div>

                <div class="toolbar_edges">
                    <v-label class="toolbar_nodes_label" style="margin-left: 20px;">Sub-System: </v-label>
                    <v-btn v-on:click="addSubSystem" class="toolbar_btn">
                        Add New
                    </v-btn>
                    <v-btn v-on:click="addExistingSubSystem" class="toolbar_btn">
                        Add Existing
                    </v-btn>
                </div>

                <div class="toolbar_nodes">
                    <v-label class="toolbar_nodes_label" style="margin-left: 20px;">View: </v-label>
                    <!-- <v-btn v-on:click="editNode" class="toolbar_btn" :disabled="selectedNodes.length == 0">
                        Edit Component
                    </v-btn> -->
                    <v-btn  v-on:click="{
                        graph?.panToCenter();
                        graph?.fitToContents();
                        }" class="toolbar_btn">
                        Recenter
                    </v-btn>
                    <v-btn  v-on:click="{
                        storeSystems.getLayouts(storeSystems.selectedId);
                    }" class="toolbar_btn">
                        Reset Layout
                    </v-btn>
                    
                </div>

                <div class="toolbar_systems">
                    <v-label for="toolbar_systems_select" style="width: 110px;">System: </v-label>
                    <v-btn v-on:click="addSystem" class="toolbar_btn">
                        Add New
                    </v-btn>
                    <v-select
                    class="toolbar_systems_select"
                    v-model="storeSystems.selectedName"
                    :items="assigned_system_names"
                    label=""
                    variant="solo"
                    style="margin-top: 20px; margin-left: 10px ;width: 100%;"
        
                ></v-select>
                </div>
            </div>
        </div>
            
            <!-- Heading -->
            <!-- <h1>Dependency Graph</h1> -->


            <!-- Graph -->
            <div class="tooltip-wrapper"> 
                <v-overlay
                :model-value="loading"
                class="align-center justify-center"
                >
                <v-progress-circular
                    color="primary"
                    indeterminate
                    size="64"
                ></v-progress-circular>
                </v-overlay>
            <v-network-graph
                ref="graph"
                class="graph"
                v-model:selected-nodes="selectedNodes"
                v-model:selected-edges="selectedEdges"
                :nodes="storeSystems.nodes"
                :edges= "storeDependencies.edges"
                :layouts="storeSystems.layouts"
                :configs="configs"
                :event-handlers="eventHandlers"
                />

                 <!-- Tooltip -->
                <div
                ref="tooltip"
                class="tooltip"
                :style="{ ...tooltipPos, opacity: tooltipOpacity }"
                >
                <div class="tooltip-info"><strong>Name: </strong>{{ component_name  }}</div>
                <div class="tooltip-info"><strong>Sub-System: </strong>{{ component_subsystem }}</div>
                <div class="tooltip-info"><strong>Version: </strong>{{ component_version }}</div>
                <div class="tooltip-info" style="font-size: 10px;"> (right click to edit)</div>
                </div>
                <template>
                        <v-dialog
                        ref="nodeMenu"
                        v-model="storeGraph.showInfoDialog"
                        max-width="500px"
                        v-on:keyup.esc="handleEsc"
                        >
                        <v-card>
                            <!-- <v-alert
                                color="warning"
                                title="Component name"
                                dismissible dark
                                v-model=""
                                text="Please enter a valid name (at least 4 characters) or leave field empty to keep it unchanged."
                            ></v-alert>
                            <v-alert
                                color="warning"
                                title="Softeware info"
                                v-model=""
                                text="Please make sure the software info you entered is at least 4 characters or leave field empty to keep it unchanged."
                            ></v-alert> -->

                            <v-card-title style="display: flex; justify-content: space-between; align-items: center;">
                            <span 
                                style="float: left;"
                                class="text-h5"
                                >Component details
                            </span>
                            <v-btn
                                icon="mdi-close"
                                style="margin-left: 10px; float: right;"
                                color="blue darken"
                                variant="text"
                                @click="closeInfo"
                            >
                            <v-tooltip
                                open-delay="100"
                                activator="parent"
                                location="top"
                            >Close</v-tooltip>
                            <v-icon style="size: 40px;">mdi-close</v-icon>
                            </v-btn>
                            </v-card-title>

                            <v-card-text>
                            <v-container class="edit_container">
                                <v-row>
                                <div class="edit_input">
                                    <v-label class="edit_label">Component name</v-label>
                                    <v-text-field
                                    v-model="edit_name"
                                    ></v-text-field>
                                </div>
                            
                                </v-row>
                                <v-row>
                                    <v-label class="edit_label">Parent system</v-label>
                                    <v-select
                                        ref="parent_select"
                                        class="parent_select"
                                        v-model="edit_parent"
                                        :items="storeSystems.subSystemNames"
                                    ></v-select>
                                </v-row>
                                <v-row>
                                    <div class="edit_input">
                                        <v-label class="edit_label">Component Version</v-label>
                                        <v-text-field
                                            v-model="edit_version"
                                            placeholder="e.g. 1.0.0"
                                        ></v-text-field>
                                    </div>

                                </v-row>
                            </v-container>
                            </v-card-text>

                            <v-card-actions>

                            <v-btn
                            style="margin-right: 0px; margin-left: 10px;"
                                icon="mdi-history"
                                color="blue darken"
                                variant="text"
                                @click="viewNodeHistory"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >History</v-tooltip>
                            <v-icon style="size: 40px;">mdi-history</v-icon>
                            </v-btn>
                            <v-btn
                            style="margin-right: 180px; margin-left: 0px;"
                                color="blue darken"
                                variant="text"
                                @click="editParent"
                            >
                                Edit Parent
                            </v-btn>

                            <v-btn  
                                icon="mdi-delete"                              
                                color="red darken"
                                variant="text"
                                @click="deleteNodeDialog"
                            >   
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Delete</v-tooltip>
                            <v-icon style="size: 40px;">mdi-delete</v-icon>
                            </v-btn>

                            <v-btn
                                icon="mdi-content-save"
                                color="blue-darken-1"
                                variant="text"
                                @click="saveEditedComponent"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Save</v-tooltip>
                            <v-icon style="size: 40px;">mdi-content-save</v-icon>
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    </template>

                    <template>
                        <v-dialog
                        ref="nodeHistory"
                        v-model="showHistoryDialog"
                        max-width="1200px"
                        v-on:keyup.esc="handleEsc"
                        >
                        <v-card>
                            <v-card-title style="display: flex; justify-content: space-between; align-items: center;">
                            <span 
                                style="float: left;"
                                class="text-h5"
                                >{{edit_name}} history
                            </span>
                            <v-btn
                                icon="mdi-close"
                                style="margin-left: 10px; float: right;"
                                color="blue darken"
                                variant="text"
                                @click="hideNodeHistory"
                            >
                            </v-btn>
                            </v-card-title>
                            <v-card-title class="search_input">
                                <v-text-field
                                style="height: 40px;"
                                class="search_input"
                                v-model="search"
                                append-icon="search"
                                label="Search"
                                single-line
                                hide-details
                                ></v-text-field>
                            </v-card-title>
                                <v-data-table
                                    :items-per-page="itemsPerPage"
                                    :headers="history_headers"
                                    :items="component_history"
                                    :search="search"
                                    :hide-default-footer="true"
                                    disable-pagination
                                    :page.sync="page"
                                    @page-count="pageCount = $event"
                                    >
                                </v-data-table>
                            <v-card-actions style="display: flex;">
                            <v-btn
                            style="float: left; margin-left: 10px;"
                                color="blue darken"
                                variant="text"
                                @click="hideNodeHistory"
                            >
                                Back
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    </template>

                    <template>
                        <v-dialog
                        ref="nodeHistory"
                        v-model="storeGraph.subSystemHistoryDialog"
                        max-width="1500px"
                        v-on:keyup.esc="handleEsc"
                        >
                        <v-card>
                            <v-card-title style="display: flex; justify-content: space-between; align-items: center;">
                            <span 
                                style="float: left;"
                                class="text-h5"
                                >{{edit_parent_name}} history
                            </span>
                            <v-btn
                                icon="mdi-close"
                                style="margin-left: 10px; float: right;"
                                color="blue darken"
                                variant="text"
                                @click="hideSubSystemHistory"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Close</v-tooltip>
                            <v-icon>mdi-close</v-icon>
                            </v-btn>
                            </v-card-title>
                            <v-card-title class="search_input">
                                <v-text-field
                                style="height: 40px;"
                                class="search_input"
                                v-model="search"
                                append-icon="search"
                                label="Search"
                                single-line
                                hide-details
                                ></v-text-field>
                            </v-card-title>
                                <v-data-table
                                    :items-per-page="itemsPerPage"
                                    :headers="history_headers_subSystem"
                                    :items="subSystem_history"
                                    :search="search"
                                    :hide-default-footer="true"
                                    disable-pagination
                                    :page.sync="page"
                                    @page-count="pageCount = $event"
                                    >
                                </v-data-table>
                           
                            <v-card-actions style="display: flex;">
                
                            <v-btn
                            icon="mdi-arrow-left"
                            style="margin-right: 20px; margin-left: 0px;"
                                color="blue darken"
                                variant="text"
                                @click="hideSubSystemHistory"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Back</v-tooltip>
                            <v-icon style="size: 40px;">mdi-arrow-left</v-icon>
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    </template>



                    <template>
                        <v-dialog
                        ref="nodeMenu"
                        v-model="storeGraph.showParentDialog"
                        max-width="500px"
                        v-on:keyup.esc="handleEsc"
                        >

                        <v-card>
                            <!-- <v-alert
                                color="warning"
                                title="Component name"
                                dismissible dark
                                v-model=""
                                text="Please enter a valid name (at least 4 characters) or leave field empty to keep it unchanged."
                            ></v-alert>
                            <v-alert
                                color="warning"
                                title="Softeware info"
                                v-model=""
                                text="Please make sure the software info you entered is at least 4 characters or leave field empty to keep it unchanged."
                            ></v-alert> -->

                            <v-card-title style="display: flex; justify-content: space-between; align-items: center;">
                            <span 
                                style="float: left;"
                                class="text-h5"
                                >Sub-System Details
                            </span>
                            <v-btn
                                icon="mdi-close"
                                style="margin-left: 10px; float: right;"
                                color="blue darken"
                                variant="text"
                                @click="closeParentInfo"
                            >
                            <v-tooltip
                                open-delay="100"
                                activator="parent"
                                location="top"
                            >Close</v-tooltip>
                            <v-icon style="size: 40px;">mdi-close</v-icon>
                            </v-btn>
                            </v-card-title>

                            <v-card-text>
                            <v-container class="edit_container">
                                <v-row>
                                <div class="edit_input">
                                    <v-label class="edit_label">Sub-System Name</v-label>
                                    <v-text-field
                                    v-model="edit_parent_name"
                                    ></v-text-field>
                                </div>
                            
                                </v-row>
                                <v-row>
                                    <div class="edit_input">
                                        <v-label class="edit_label">Sub-System Version</v-label>
                                        <v-text-field
                                            placeholder="e.g. 1.0.0"
                                            v-model="edit_parent_version"
                                        ></v-text-field>
                                    </div>
                                </v-row>
                                <v-row>
                                    <div class="d-flex justify-space-around" style="width: 100%;">
                                        <v-color-picker
                                        justify-content="space-around"
                                        align-content="center"
                                        width="100%"
                                        v-model="edit_parent_color"
                                        mode="hex"
                                        ></v-color-picker>
                                        </div>

                                </v-row>
                            </v-container>
                            </v-card-text>

                            <v-card-actions>
                                
                            <v-btn
                            icon="mdi-arrow-left"
                            style="margin-right: 20px; margin-left: 0px;"
                                color="blue darken"
                                variant="text"
                                @click="closeParentInfo"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Back</v-tooltip>
                            <v-icon style="size: 40px;">mdi-arrow-left</v-icon>
                            </v-btn>
                            <v-btn
                            style="margin-right: 262px; margin-left: -20px;"
                                icon="mdi-history"
                                color="blue darken"
                                variant="text"
                                @click="viewSubsystemHistory"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >History</v-tooltip>
                            <v-icon style="size: 40px;">mdi-history</v-icon>
                            </v-btn>
                               
                            <v-btn  
                                icon="mdi-delete"                              
                                color="red darken"
                                variant="text"
                                @click="deleteNodeDialog"
                            >   
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Delete</v-tooltip>
                            <v-icon style="size: 40px;">mdi-delete</v-icon>
                            </v-btn>

                           
                            <v-btn
                                icon="mdi-content-save"
                                color="blue-darken-1"
                                variant="text"
                                @click="saveSubSystem"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Save</v-tooltip>
                            <v-icon style="size: 40px;">mdi-content-save</v-icon>
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    </template>

                    <template>
                        <v-dialog
                        ref="nodeMenu"
                        v-model="storeGraph.showAddExistingSubSystemDialog"
                        max-width="500px"
                        v-on:keyup.esc = "handleEsc"
                        >

                        <v-card>
                            <v-alert
                                color="success"
                                title="Success"
                                dismissible dark
                                v-model="alert_success_new_subsystem"
                                text="Sub-System added successfully."
                            ></v-alert>

                            <v-card-title style="display: flex; justify-content: space-between; align-items: center;">
                            <span 
                                style="float: left;"
                                class="text-h5"
                                >Add Existing Sub-System
                            </span>
                            <v-btn
                                icon="mdi-close"
                                style="margin-left: 10px; float: right;"
                                color="blue darken"
                                variant="text"
                                @click="storeGraph.showAddExistingSubSystemDialog = false"
                            >
                            <v-tooltip
                                open-delay="100"
                                activator="parent"
                                location="top"
                            >Close</v-tooltip>
                            <v-icon style="size: 40px;">mdi-close</v-icon>
                            </v-btn>
                            </v-card-title>

                            <v-card-text>
                            <v-container class="edit_container">
                                <v-row>
                                    <v-label class="edit_label">Parent system</v-label>
                                    <v-select
                                        ref="parent_select"
                                        class="parent_select"
                                        v-model="add_existing_system"
                                        :items="assigned_system_names"
                                        @click="getAssignedSubSystemNames"
                                        ></v-select>
                                </v-row>
                                <v-row>
                                    <v-label class="edit_label">Sub-System</v-label>
                                    <v-select
                                        ref="parent_select"
                                        class="parent_select"
                                        v-model="add_existing_subsystem"
                                        :items="assigned_subSystem_names"
                                        ></v-select>
                                </v-row>
                               
                            </v-container>
                            </v-card-text>
                            <v-card-actions>  
                            <v-btn  
                                style="margin-right: 0px; margin-left: 370px;"
                                icon="mdi-cancel"                              
                                color="red darken"
                                variant="text"
                                @click="storeGraph.showAddExistingSubSystemDialog = false"
                            >   
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Cancel</v-tooltip>
                            <v-icon style="size: 40px;">mdi-cancel</v-icon>
                            </v-btn>

                            <v-btn
                                icon="mdi-content-save"
                                color="blue-darken-1"
                                variant="text"
                                @click="saveAddExistingSubSystem"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Save</v-tooltip>
                            <v-icon style="size: 40px;">mdi-content-save</v-icon>
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    </template>

                    <template>
                        <v-dialog
                        ref="nodeMenu"
                        v-model="storeGraph.newParentDialog"
                        max-width="500px"
                        v-on:keyup.esc="handleEsc"
                        >

                        <v-card>
                            <v-alert
                                color="success"
                                title="Success"
                                dismissible dark
                                v-model="alert_success_new_subsystem"
                                text="Subsystem created successfully."
                            ></v-alert>

                            <v-card-title style="display: flex; justify-content: space-between; align-items: center;">
                            <span 
                                style="float: left;"
                                class="text-h5"
                                >New Sub-System Details
                            </span>
                            <v-btn
                                icon="mdi-close"
                                style="margin-left: 10px; float: right;"
                                color="blue darken"
                                variant="text"
                                @click="storeGraph.newParentDialog = false"
                            >
                            <v-tooltip
                                open-delay="100"
                                activator="parent"
                                location="top"
                            >Close</v-tooltip>
                            <v-icon style="size: 40px;">mdi-close</v-icon>
                            </v-btn>
                            </v-card-title>

                            <v-card-text>
                            <v-container class="edit_container">
                                <v-row>
                                <div class="edit_input">
                                    <v-label class="edit_label">Sub-System Name</v-label>
                                    <v-text-field
                                    placeholder="min. 2 characters"
                                    v-model="new_subsystem_name"
                                    ></v-text-field>
                                </div>
                            
                                </v-row>

                                <v-row>
                                <div class="edit_input">
                                    <v-label class="edit_label">Sub-System Version</v-label>
                                    <v-text-field
                                    placeholder="e.g. 1.0.0"
                                    v-model="new_subsystem_version"
                                    ></v-text-field>
                                </div>
                            
                                </v-row>
                                <v-row>
                                    <div class="d-flex justify-space-around" style="width: 100%;">
                                        <v-color-picker
                                        justify-content="space-around"
                                        align-content="center"
                                        width="100%"
                                        v-model="new_subsystem_color"
                                        mode="hex"
                                        ></v-color-picker>
                                    </div>

                                </v-row>
                            </v-container>
                            </v-card-text>

                            <v-card-actions>  
                            <v-btn  
                                style="margin-right: 0px; margin-left: 370px;"
                                icon="mdi-cancel"                              
                                color="red darken"
                                variant="text"
                                @click="storeGraph.newParentDialog = false"
                            >   
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Cancel</v-tooltip>
                            <v-icon style="size: 40px;">mdi-cancel</v-icon>
                            </v-btn>

                            <v-btn
                                icon="mdi-content-save"
                                color="blue-darken-1"
                                variant="text"
                                @click="checkSubSystemName"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Save</v-tooltip>
                            <v-icon style="size: 40px;">mdi-content-save</v-icon>
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    </template>
            </div>

            <template>
                    <v-dialog v-model="dialogDelete" max-width="560px">
                        <v-card>
                            <v-card-title class="text-h5">Are you sure you want to delete this component?</v-card-title>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="deleteNodeConfirm">Delete</v-btn>
                            <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>

            <template>
                <v-dialog v-model="dialogDeleteNodes" max-width="600px"
                v-on:keyup.esc="handleEsc"
                >
                    <v-card>
                        <v-card-title v-if="selectedNodes.length > 2" class="text-h5">Are you sure you want to delete all {{ selectedNodes.length }} components?</v-card-title>
                        <v-card-title v-if="selectedNodes.length == 2" class="text-h5">Are you sure you want to delete both components?</v-card-title>
                        <v-card-title v-if="selectedNodes.length == 1" class="text-h5">Are you sure you want to delete this component?</v-card-title>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="deleteNodeConfirm">Delete</v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template>

            <template>
                <v-dialog v-model="subSystemWithSameNameDialog" max-width="1000px"
                v-on:keyup.esc="handleEsc"
                >
                    <v-card>
                        <v-card-title class="text-h5">A sub-system with this name already exists, are you sure you want to add this sub system?</v-card-title>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue-darken-1" variant="text" @click="closeAddSubSystemWithSameNameDialog">Cancel</v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="continueWithSubSystem">Yes</v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template>

                <template>
                        <v-dialog
                        v-model="dialog_new"
                        max-width="500px"
                        v-on:keyup.esc="handleEsc"
                        >
                        <v-card>

                            <v-card-title>
                            <span class="text-h5">New Component Details</span>
                            <v-btn
                                icon="mdi-close"
                                style="margin-left: 10px; float: right;"
                                color="blue darken"
                                variant="text"
                                @click="closeNew"
                            >
                            <v-tooltip
                                open-delay="100"
                                activator="parent"
                                location="top"
                            >Close</v-tooltip>
                            <v-icon style="size: 40px;">mdi-close</v-icon>
                            </v-btn>
                            </v-card-title>
                           
                            <v-card-text>
                            <v-container class="edit_container">
                                <v-row>
                                <div class="edit_input">
                                    <v-label class="edit_label">Component name</v-label>
                                    <v-text-field
                                    placeholder="Enter component name"
                                    v-model="new_component_name"
                                    ></v-text-field>
                                </div>
                            
                                </v-row>
                                <v-row>
                                    <v-label class="edit_label">Sub-System</v-label>
                                    <v-select
                                    placeholder="Select parent system"
                                        class="parent_select"
                                        v-model="new_component_parent"
                                        :items="storeSystems.subSystemNames"
                                    ></v-select>
                                </v-row>
                                <v-row>
                                    <div class="edit_input">
                                        <v-label class="edit_label">Version</v-label>
                                        <v-text-field
                                            placeholder="e.g. 1.0.0"
                                            v-model="new_component_version"
                                        ></v-text-field>
                                    </div>
                                </v-row>
                            </v-container>
                            </v-card-text>

                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                icon="mdi-cancel"
                                color="red-darken-1"
                                variant="text"
                                @click="closeNew"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Cancel</v-tooltip>
                            <v-icon style="size: 40px;">mdi-cancel</v-icon>
                            </v-btn>
                            <v-btn
                                icon="mdi-content-save"
                                color="blue-darken-1"
                                variant="text"
                                @click="saveNew"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Save</v-tooltip>
                            <v-icon style="size: 40px;">mdi-content-save</v-icon>
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    </template>

                    <template>
                        <v-dialog
                        v-model="dialog_new_system"
                        max-width="500px"
                        v-on:keyup.esc="handleEsc"
                        >
                        <v-card>
                            <v-card-title>
                            <span class="text-h5">New System Details</span>
                            <v-btn
                                icon="mdi-close"
                                style="margin-left: 10px; float: right;"
                                color="blue darken"
                                variant="text"
                                @click="closeNewSystem"
                            >
                            <v-tooltip
                                open-delay="100"
                                activator="parent"
                                location="top"
                            >Close</v-tooltip>
                            <v-icon style="size: 40px;">mdi-close</v-icon>
                            </v-btn>
                            </v-card-title>
                        
                            <v-card-text>
                            <v-container class="edit_container">
                                <v-row>
                                <div class="edit_input">
                                    <label class="edit_label">System name</label>
                                    <v-text-field
                                    placeholder="Enter system name"
                                    v-model="new_system_name"
                                    ></v-text-field>
                                </div>
                            
                                <div class="input-element" style="margin-bottom: 100px;">
                                    <label class="input-label" for="component-name">Visible to:</label>
                                    <div class="checkboxes">
                                        <div class="checkbox">
                                            <input type="checkbox" class="role" name="developer" value="Developer" v-model="developer"> 
                                            <v-label for="developer">Developers</v-label>
                                        </div>
                                        <div class="checkbox">
                                            <input type="checkbox" class="role" name="support" value="Support" v-model="support">  
                                            <v-label for="support" >Support</v-label>
                                        </div>
                                        <div class="checkbox">
                                            <input type="checkbox" class="role" name="sit" value="SIT" v-model="sit">          
                                            <v-label for="sit">SIT</v-label>
                                        </div>     
                                    </div>                 
                                </div>
                                </v-row>
                            </v-container>
                            </v-card-text>

                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                icon="mdi-cancel"
                                color="red-darken-1"
                                variant="text"
                                @click="closeNewSystem"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Cancel</v-tooltip>
                            <v-icon style="size: 40px;">mdi-cancel</v-icon>
                            </v-btn>
                            <v-btn
                                icon="mdi-content-save"
                                color="blue-darken-1"
                                variant="text"
                                @click="saveNewSystem"
                            >
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Save</v-tooltip>
                            <v-icon style="size: 40px;">mdi-content-save</v-icon>
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    </template>
        </div>
    </div>
</template>

<script lang="ts">
import Header from "../components/Home_Header.vue";
import SideMenu from "../components/SideMenu.vue";
import * as vNG from "v-network-graph"
import { computed, getCurrentInstance, reactive, ref, watch } from "vue"
import { Nodes, Edges, Layouts } from "v-network-graph";
import router from "../router";
import { VDataTable } from 'vuetify/labs/VDataTable'
import SystemsService from "../services/SystemsService";
import ComponentService from "../services/ComponentService";
import SubSystemService from "../services/SubSystemService";
import UserSystemsService from "../services/UserSystemsService";
import UserService from "../services/UserService";
import DependencyService from "../services/DependencyService";

const nodes: Nodes = reactive({});
const edges: Edges = reactive({});

const selectedNodes = ref([]) as any;
const selectedEdges = ref([])

const layouts: Layouts = ({
  nodes: {},
})

interface Node extends vNG.Node {
  size: number
  color: string
  label?: boolean
}

interface Edge extends vNG.Edge {
  width: number
  color: string
  dashed?: boolean
}

const initialConfigs = reactive(
    vNG.defineConfigs<Node, Edge>({
        view: {
            boxSelectionEnabled: true,
            scalingObjects: true,
            minZoomLevel: 0.3,
            maxZoomLevel: 5,
            selection: {
                box: {
                    color: "#0000ff20",
                    strokeWidth: 1,
                    strokeColor: "#aaaaff",
                    strokeDasharray: "0",
                },
            },
        },
        node: {
            selectable: true,
            normal: {
                type: "rect",
                width: 35,
                height: 35,
                borderRadius: 8,
                color: node => node.color + "ec",
            },
            hover: {
                color: node => node.color,
                width: 55,
                height: 55,
                borderRadius: 8,
                
            },
            label: {
                fontSize: 9,
                color: "#000000",
                direction: "south",
                margin: 10,
                lineHeight: 1.1,
                
            },
        },
        edge: {
           selectable: 1,
           type: "curve",
           gap: 20,
            normal: {
                width: edge => edge.width,
                color: edge => edge.color,
            },
            marker: {
                target: {
                type: "arrow",
                width: 6,
                height: 6,
                },
            },
            hover: {
                width: 3,
                color: "blue",
                dasharray: "0",
                linecap: "butt",
                animate: false,
                animationSpeed: 10,
            },
            selected: {
                width: 3,
                color: "blue",
                dasharray: "6",
                linecap: "round",
                animate: true,
                animationSpeed: 50,
            },
        },
    })
)

const configs = reactive(initialConfigs)

export default {
    name: "DependencyGraph",
    
    data() {
        return {   

            page: 1,
                pageCount: 0,
                itemsPerPage: 100,
                history_headers_subSystem: [
                {
                    align: 'start',
                    sortable: false,
                    },
                    { title: 'Name', key: 'name', sortable: true ,align: 'start' },
                    { title: 'Parent', key: 'parent', align: 'start' },
                    { title: 'Color', key: 'color', align: 'start' },
                    { title: 'Version', key: 'version', align: 'start' },
                    { title: 'Updated', key: 'updated', align: 'start'},
                    { title: 'User', key: 'user', align: 'start'},
                    { title: 'Action', key: 'action', align: 'start' },
                ],
                history_headers: [
                    {
                    align: 'start',
                    sortable: false,
                    },
                    { title: 'Name', key: 'name', sortable: true ,align: 'start' },
                    { title: 'Parent', key: 'parent', align: 'start' },
                    { title: 'Version', key: 'version', align: 'start' },
                    { title: 'Updated', key: 'updated', align: 'start'},
                    { title: 'User', key: 'user', align: 'start'},
                    { title: 'Action', key: 'action', align: 'start' },

                ],
                
            // Alerts 
            success_dependency: false,
            alert_name: false,

            // Dialogs
            dialog: false,
           
            // Graph 
            selectedEdges: selectedEdges,
            selectedNodes: selectedNodes,
            nodes: nodes,
            edges: edges,
            layouts: layouts,
            configs: configs,
            value: null,
        }
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
    },
    methods: {
        async changeStatus() {
            for (let i = 0; i < selectedEdges.value.length; i++) {
                if (this.$pinia.state.value.dependencies.edges[selectedEdges.value[i]].color == "red") {

                    // Update local pinia store 
                    this.$pinia.state.value.dependencies.edges[selectedEdges.value[i]].color = "green";
                    let id = (this.$pinia.state.value.dependencies.edges[selectedEdges.value[i]].id);
                    let index = this.$pinia.state.value.dependencies.dependencies.findIndex(((item: any) => item.id == id))
                    this.$pinia.state.value.dependencies.dependencies[index].faulty = false;

                    // Update the database 
                    const dependency = {
                        id: this.$pinia.state.value.dependencies.edges[selectedEdges.value[i]].id,
                        faulty: 0,
                    }

                    const record = (await DependencyService.put(dependency))
                    this.$pinia.state.value.dependencies.refresh = true;
                    // alert("Status changed to working!")

                } else {

                    // Update local pinia store 
                    this.$pinia.state.value.dependencies.edges[selectedEdges.value[i]].color = "red";
                    let id = (this.$pinia.state.value.dependencies.edges[selectedEdges.value[i]].id);
                    let index = this.$pinia.state.value.dependencies.dependencies.findIndex(((item: any) => item.id == id))
                    this.$pinia.state.value.dependencies.dependencies[index].faulty = true;

                    // Update the database 
                    const dependency = {
                        id: this.$pinia.state.value.dependencies.edges[selectedEdges.value[i]].id,
                        faulty: 1,
                    }
                    const record = (await DependencyService.put(dependency))
                    this.$pinia.state.value.dependencies.refresh = true;
                }
            }
            selectedEdges.value = [];

        },    
        editNode() {
            const record = this.$pinia.state.value.components.components.filter((item: any) => item.id == this.selectedNodes[0])[0];
        },
         close () {
                this.dialog = false
        },
    },
      
    components: {
        Header,
        SideMenu,
        
    },
};

</script>

<script setup lang="ts">
import { useDependencyStore } from "../stores/dependencies.js";
import { useGraphStore } from "../stores/graph.js";
import { useUserStore } from "../stores/user.js";
import { useSystemsStore } from "../stores/systems";

const userStore = useUserStore();

if (userStore.valid == false) {
    router.push("/login");
}

let search = ref("");
let loading = ref(true);
let showHistoryDialog = ref(false);
const graph = ref<vNG.Instance>()
const component_history: {name: string, parent: string, version: string, updated: string, user: string, action: string}[] = reactive([]);
let subSystem_history: {name: string, parent: string, color: string, version: string, updated: string, user: string, action: string}[] = reactive([]);
const assigned_system_names: string[] = reactive([]);
const assigned_subSystem_names: string[] = reactive([]);

const storeDependencies = useDependencyStore();
const storeGraph = useGraphStore();
const storeSystems = useSystemsStore();
const storeUser = useUserStore();

if (storeSystems.refresh && storeSystems.lock == false) {
    storeSystems.loadSystems().then (() => {
        getAssignedSystemNames();
        storeSystems.getLayouts(storeSystems.selectedId).then(() => {
            graph?.value?.panToCenter();
            graph?.value?.fitToContents();
            loading.value = false;
        })
    })
} else {
    getAssignedSystemNames();
    graph?.value?.panToCenter();
    graph?.value?.fitToContents();
    loading.value = false;
}

if (storeDependencies.refresh && storeDependencies.lock == false) {
    storeDependencies.loadDependencies();
}

storeSystems.getLayouts(assigned_system_names[0]);
// Alerts 

let alert_subsystem_name = ref(false);
let alert_system_name = ref(false);

const tooltip = ref<HTMLDivElement>()

const targetNodeId = ref<string>("")
const tooltipOpacity = ref(0) // 0 or 1
const tooltipPos = ref({ left: "0px", top: "0px" })

const targetNodePos = computed(() => {
    if (storeSystems.layouts.nodes === undefined) {
        return { x: 0, y: 0 }
    } else {
        const nodePos = storeSystems?.layouts.nodes[targetNodeId.value] ?? {x: 0, y: 0}
        return nodePos
    }
})

// Add existing subsystem dialog
let add_existing_system = ref("");
let add_existing_subsystem = ref("");

// Watch when parent system changes when adding an existing sub-system
watch(
    () => add_existing_system.value,
    () => {
        getAssignedSubSystemNames();
        add_existing_subsystem.value = "";
    }
)
// Update selected system when dropdown changes (The system the user is currently viewing)
watch(
    () => storeSystems.selectedName,
    () => {
        loading.value = true;
        storeSystems.selectedId = storeSystems.systems.filter((item: any) => item.name == storeSystems.selectedName)[0].id;
        storeSystems.getLayouts(storeSystems.selectedId).then(() => {
            storeSystems.getSubSystemNames(storeSystems.selectedId);
            graph?.value?.panToCenter();
            graph?.value?.fitToContents();
            loading.value = false;
        })
    }
)
// Update `tooltipPos`
watch(
    () => [targetNodePos.value, tooltipOpacity.value],
    () => {
        if (!graph.value || !tooltip.value) return
    // translate coordinates: SVG -> DOM
        const domPoint = graph.value.translateFromSvgToDomCoordinates(targetNodePos.value)
    // calculates top-left position of the tooltip.
        tooltipPos.value = {
        left: domPoint.x - tooltip.value.offsetWidth / 2 + "px",
        top: domPoint.y - 40 - tooltip.value.offsetHeight - 10 + "px",
        }
  },
  { deep: true }
)

const dialog_new = ref(false);
const dialog_new_system = ref(false);

// Component Hover 
let component_name = ref("");
let component_subsystem = ref("");
let component_version = ref("");

// Edit component dialog
let edit_id: string = "";
let edit_name = ref("");
let edit_version = ref("");
var edit_parent = ref("");

// Edit parent dialog
let edit_parent_id: string = "";
let edit_parent_name = ref("");
let edit_parent_color = ref("");
var edit_parent_parent = ref("");
var edit_parent_version = ref("");

// new sub-system dialog
let new_subsystem_name = ref("");
let new_subsystem_color = ref("");
var new_subsystem_parent = ref("");
var new_subsystem_version = ref("");

// New component dialog
let new_component_name = ref("");
let new_component_version = ref("");
var new_component_parent = ref("");

// New system dialog
let new_system_name = ref("");
let developer = ref(false);
let support = ref(false);
let sit = ref(false);
  
// Delete dialog
let dialogDelete = ref(false);
let dialogDeleteNodes = ref(false);

// SubSystem with same name dialog
let subSystemWithSameNameDialog = ref(false);

function showContextMenu(element: HTMLElement, event: MouseEvent) {

  element.style.left = event.x + "px"
  element.style.top = event.y + "px"
  element.style.visibility = "visible"
  const handler = (event: PointerEvent) => {
    if (!event.target || !element.contains(event.target as HTMLElement)) {
      element.style.visibility = "hidden"
      document.removeEventListener("pointerdown", handler, { capture: true })
    }
  }
  document.addEventListener("pointerdown", handler, { passive: true, capture: true })
}

const viewMenu = ref<HTMLDivElement>()
function showViewContextMenu(params: vNG.ViewEvent<MouseEvent>) {
    const { event } = params
    // Disable browser's default context menu
    event.stopPropagation()
    event.preventDefault()
    if (viewMenu.value) {
        showContextMenu(viewMenu.value, event)
    }
}

const nodeMenu = ref<HTMLDivElement>()

function showNodeContextMenu(params: vNG.NodeEvent<MouseEvent>) {
    storeGraph.showInfoDialog = true;
    const record = storeSystems?.componentsFromDB.filter((item: any) => item.id == params.node);
    selectedNodes.value.length = 0;
    selectedNodes.value[0] = params.node;
    edit_id = record[0]?.id;
    edit_name.value = record[0]?.name;
    if (record[0]?.version != "") {
        edit_version.value = record[0]?.version;
    } else 
        edit_version.value = "";

    let parent_id = record[0]?.SubsystemId;
    const sub_system = storeSystems.subSystemsFromDB.filter((item: any) => item.id == parent_id);
    edit_parent.value = sub_system[0]?.name;


    // Set component info in info dialog
    edit_parent_id = sub_system[0]?.id;
    edit_parent_name.value = sub_system[0]?.name;
    edit_parent_color.value = sub_system[0]?.color;
    edit_parent_parent.value = storeSystems.selectedName;
    edit_parent_version.value = sub_system[0]?.version;

    const { node, event } = params
    // Disable browser's default context menu
    event.stopPropagation()
    event.preventDefault()
}

function closeInfo() {
    storeGraph.showInfoDialog = false;
}

function closeNew() {
    dialog_new.value = false;
}

function closeNewSystem() {
    dialog_new_system.value = false;
}

function deleteNodeDialog() {
    dialogDelete.value = true;
}
function deleteNodesDialog() {
    dialogDeleteNodes.value = true;
}

function addSubSystemWithSameNameDialog() {
    subSystemWithSameNameDialog.value = true;
}

function closeAddSubSystemWithSameNameDialog() {
    subSystemWithSameNameDialog.value = false;
}

function continueWithSubSystem() {
    subSystemWithSameNameDialog.value = false;
    newSubSystem();
}
function getComponentInfo() {
    let nodeId = targetNodeId.value;
    let subSystemId = storeSystems.componentsFromDB.filter((item: any) => item.id == nodeId)[0].SubsystemId;
    component_subsystem = storeSystems.subSystemsFromDB.filter((item: any) => item.id == subSystemId)[0]?.name ?? "";
    component_name = storeSystems.componentsFromDB.filter((item: any) => item.id == nodeId)[0].name;
    component_version = storeSystems.componentsFromDB.filter((item: any) => item.id == nodeId)[0].version;
}

const eventHandlers: vNG.EventHandlers = {
    "view:contextmenu": showViewContextMenu,
    "node:contextmenu": showNodeContextMenu,
    "node:pointerover": ({ node }) => {
        targetNodeId.value = node
        tooltipOpacity.value = 1 // show
        getComponentInfo();
    },
    "node:pointerout": _ => {
        tooltipOpacity.value = 0 // hide
    },
}

async function addNode() {
    dialog_new.value = true;
    new_component_name.value = "";
    new_component_version.value = "";
    new_component_parent.value = "";
}

function addSystem() {
    dialog_new_system.value = true;
}

async function addDependency() {  
    let records = null as any;
    try {
        records = (await DependencyService.show(selectedNodes.value[0], selectedNodes.value[1]));
    }
    catch (error) {
        // console.log(error);
    }

    if (records != null && records.data.length > 0) {
        alert("Dependency already exists");
        return;
    } else {
        const data = {
            source: selectedNodes.value[0],
            target: selectedNodes.value[1],
            faulty: false,
        }

        const record = (await DependencyService.post(data)).data;
        console.log(record);

        // Update local pinia store
        storeDependencies.addDependency({id: record.id, target: data.target, source: data.source, faulty: false});
        storeDependencies.populateEdges();
        storeDependencies.refresh = true;
        selectedEdges.value = [];
    }
}
async function saveSubSystem() {

    if (edit_parent_name.value.trim().length < 2) {
        alert_subsystem_name.value = true;
        return;
    } else 
        alert_subsystem_name.value = false;


    const subSystem = storeSystems.subSystemsFromDB.find((subsystem: any) => subsystem.id == edit_parent_id);
    if (edit_parent_name.value == subSystem.name && edit_parent_color.value == subSystem.color && storeSystems.systems.find((system) => system.name == storeSystems.selectedName)?.id  == subSystem.SystemId && edit_parent_version.value == subSystem.version) {
        storeGraph.showParentDialog = false;
        return;
    }

    let system_id = storeSystems.systems.find((system: any) => system.name == edit_parent_parent)?.id;

    const new_sub_data = {
        "id": subSystem.id,
        "name": edit_parent_name.value,
        "color": edit_parent_color.value,
        "version": edit_parent_version.value,
        "SystemId": system_id,
        "history": 0,
        "action": "edited"
    };
    const new_sub_system = (await SubSystemService.put(new_sub_data)).data;
    await SubSystemService.delete(subSystem.id);
    storeSystems.loadSystems().then(() => {
        graph?.value?.panToCenter()
        graph?.value?.fitToContents();
    })

    edit_parent.value = new_sub_system.name;
    storeGraph.showParentDialog = false;
    storeGraph.showInfoDialog = false;
}

async function saveAddExistingSubSystem() {
    let system_id = storeSystems.systems.find((system: any) => system.name == add_existing_system.value)?.id;

    let subsystem = storeSystems.subSystemsFromDB.find((subsystem: any) => subsystem.name == add_existing_subsystem.value && subsystem.SystemId == system_id && subsystem.history == false) ?? null;
    console.log(subsystem);
    // if (subsystem != null) {
    let children = (await SubSystemService.getChildren(subsystem.id)).data;
    
    const subsystem_data = {
        "name": subsystem.name + " (import)",
        "color": subsystem.color,
        "SystemId": storeSystems.selectedId,
        "version": subsystem.version,
        "history": 0,
        "action": "imported from " + add_existing_system.value + " to " + storeSystems.selectedName + "(ID " + storeSystems.selectedId + ")",
    }
    const new_subsystem = await SubSystemService.post(subsystem_data);

    // iterate through children array
    for (let i = 0; i < children.length; i++) {
        // Find component
        let component = storeSystems.componentsFromDB.find((component: any) => component.id == children[i].id) ?? null;
        console.log(component);
        if (component != null) {
            const data = {
                "name": component.name,
                "SubsystemId": new_subsystem.data.id,
                "version": component.version,
                "history": 0,
                "action": "imported from " + add_existing_system.value + " to " + storeSystems.selectedName,
            }
            const new_component = await ComponentService.post(data);
        }
    }
    storeSystems.loadSystems().then(() => {
        graph?.value?.panToCenter();
        graph?.value?.fitToContents()
    });
    storeGraph.showAddExistingSubSystemDialog = false;
}

const alert_success_new_subsystem = ref(false);

async function checkSubSystemName() {         
   // check if sub system name already exists
   if (storeSystems.subsystems.includes(new_subsystem_name.value)) {
        addSubSystemWithSameNameDialog();
   } else {
        newSubSystem();
   }
}

async function newSubSystem() {

    const data = {
        "name": new_subsystem_name.value,            
        "color": new_subsystem_color.value,
        "SystemId": storeSystems.selectedId,
        "history": 0,
    };
    await SubSystemService.post(data);
    storeSystems.refreshSubSystems();
    storeGraph.newParentDialog = false;
}

function editParent() {
    storeGraph.showParentDialog = true;
}
function closeParentInfo() {
    storeGraph.showParentDialog = false;
}
function hideSubSystemHistory() {
    storeGraph.subSystemHistoryDialog = false;
}

async function viewSubsystemHistory() {
    storeGraph.subSystemHistoryDialog = true;
    subSystem_history.length = 0;
    search.value = "";
    let subsystem_id = storeSystems.componentsFromDB.find((component: any) => component.id == selectedNodes.value[0])?.SubsystemId;

    let history_data = (await SubSystemService.getHistory(subsystem_id)).data;
    for (let i = 0; i < history_data.length; i++) {
        let system = storeSystems.systems.find((system: any) => system.id == history_data[i].SystemId);
        let updatedAt = history_data[i].updatedAt.substring(0, 10) + " " + history_data[i].updatedAt.substring(11, 16);
        subSystem_history[i] = ({name: history_data[i].name, color: history_data[i].color, version: history_data[i].version, updated: updatedAt, parent: system.name, action: history_data[i].action, user: "user"});
    }
}
function closeDelete () {
    dialogDelete.value = false;
    dialogDeleteNodes.value = false;
    storeGraph.showInfoDialog = false;
    selectedNodes.length = 0;
}

async function deleteNodeConfirm () {
    selectedNodes.value.length

    for (let k = 0; k < selectedNodes.value.length; k++) {
        // Get component
        const component = (await ComponentService.show(selectedNodes.value[k])).data;
        // Delete component
        await ComponentService.delete(selectedNodes.value[k]);
        // Get subsystem children
        const children = (await SubSystemService.getChildren(component.SubsystemId)).data;
        if (children.length == 0) {
            // Delete subsystem
            await SubSystemService.delete(component.SubsystemId);
        }
    }
    storeSystems.loadSystems().then(() => {
        storeSystems.getLayouts(storeSystems.selectedId).then(() => {
            graph?.value?.panToCenter();
            graph?.value?.fitToContents();
        })
    });
    closeDelete()
}

function hideNodeHistory() {
    showHistoryDialog.value = false;
}

async function viewNodeHistory() {
    showHistoryDialog.value = true;
    component_history.length = 0;
    search.value = "";

    let history_data = (await ComponentService.getHistory(selectedNodes.value[0])).data;
    console.log(history_data);
    for (let i = 0; i < history_data.length; i++) {
        let subsystem = storeSystems.subSystemsFromDB.find((subsystem: any) => subsystem.id == history_data[i].SubsystemId);
        let updatedAt = history_data[i].updatedAt.substring(0, 10) + " " + history_data[i].updatedAt.substring(11, 16);
        component_history[i] = ({name: history_data[i].name, version: history_data[i].version, updated: updatedAt, parent: subsystem.name, action: history_data[i].action, user: "user"});
    }
}

async function addSubSystem() {
    storeGraph.newParentDialog = true;
    new_subsystem_name.value = "";
    new_subsystem_color.value = "#428971";
    new_subsystem_parent.value = storeSystems.selectedId;
}

function addExistingSubSystem() {
    storeGraph.showAddExistingSubSystemDialog = true;
}

async function saveNewSystem() {
    if (new_system_name.value.trim().length <= 3) {
        alert_system_name.value = true;
        console.log("System name must be at least 3 characters long");
        return;
    } else 
        alert_system_name.value = false;

    const data = {
        "name": new_system_name.value,
    };

    const new_system = (await SystemsService.post(data)).data;

    let userSystems: { UserId: any; SystemId: any; }[] = [];

    if (developer.value) {
        const users = await UserService.getUsersByRole("Developer");

        users.data.forEach((element: any) => {
            userSystems.push({UserId: element.id, SystemId: new_system.id});
        });
    }

    if (support.value) {
        const users = await UserService.getUsersByRole("Support");

        users.data.forEach((element: any) => {
            userSystems.push({UserId: element.id, SystemId: new_system.id});
        });
    }

    if (sit.value) {
        const users = await UserService.getUsersByRole("SIT");

        users.data.forEach((element: any) => {
            userSystems.push({UserId: element.id, SystemId: new_system.id});
        });
    }

    UserSystemsService.post(userSystems)
    .then (async () => {
        await storeSystems.loadSystems();
        await storeSystems.getLayouts(storeSystems.selectedId);
        graph?.value?.panToCenter();
        graph?.value?.fitToContents();
        getAssignedSystemNames();
    })
    closeNewSystem();
}

// Add new component
async function saveNew() {

    // Find parent system id from name
    let system_index = storeSystems.systems.findIndex((system: any) => system.id == storeSystems.selectedId);
    let subsystem_index = storeSystems.systems[system_index].subsystems.findIndex((subsystem: any) => subsystem.name == new_component_parent.value);
    let parent_id = storeSystems.systems[system_index].subsystems[subsystem_index].id;

    const data = {
        "name": new_component_name.value,
        "SubsystemId": parent_id,
        "version": new_component_version.value,
        "history": 0,
        "action": "created"
    }

    try {
        await ComponentService.post(data);
    } catch (error) {
        // console.log(error);
    }

    storeSystems.loadSystems();
 
    dialog_new.value = false;
}

async function deleteDependency() {

    if (confirm("Are you sure you want to delete this dependency?")) {
        let id = storeDependencies.edges[selectedEdges.value[0]].id;

        // Delete from database 
        const record = await DependencyService.delete(id); 
        
        // Update local pinia store
        storeDependencies.remove(id);
        storeDependencies.populateEdges();
        storeDependencies.refresh = true;

        // Clear selected edges
        selectedEdges.value = [];
    }
}
async function getAssignedSystemNames() {
    let assigned_ids = (await UserService.getAssignedSystems(storeUser.id)).data;
    for (let i = 0; i < assigned_ids.length; i++) {
        let system_index = storeSystems.systems.findIndex((system: any) => system.id == assigned_ids[i]);
        assigned_system_names[i] = storeSystems.systems[system_index].name;
    }
}

async function getAssignedSubSystemNames() {
    assigned_subSystem_names.length = 0;
    assigned_subSystem_names.length = 0;

    let system_id = storeSystems.systems.find((system: any) => system.name == add_existing_system.value).id;

    const children = (await SystemsService.getChildren(system_id)).data;
    
    for (let i = 0; i < children.length; i++) {
        assigned_subSystem_names[i] = children[i].name;
    }
}

async function saveEditedComponent() {
    const record = storeSystems.componentsFromDB.find((component: any) => component.id == edit_id && component.history == 0);
    let system_index = storeSystems.systems.findIndex((system: any) => system.id == storeSystems.selectedId);
    let edit_subsystem_id = storeSystems.systems[system_index].subsystems.find((subsystem: any) => subsystem.name == edit_parent.value).id;

    if (record) {
        if (record.name == edit_name.value && record.version == edit_version.value && record.SubsystemId == edit_subsystem_id) {
            closeInfo();
            return
        }   
    }

    const data = {
        "id": edit_id,
        "name": edit_name.value,
        "SubsystemId": edit_subsystem_id,
        "version": edit_version.value,
        "history": 0,
        "action": "edited"
    }

    try {
        await ComponentService.put(data);

    } catch (error) {
        // console.log(error);
    }

    storeSystems.loadSystems().then(() => {
        storeDependencies.loadDependencies();
        graph?.value?.panToCenter();
        graph?.value?.fitToContents();
    });

    closeInfo()
}

function handleEsc() {
    storeGraph.showInfoDialog = false;
    storeGraph.showAddExistingSubSystemDialog = false;
    storeGraph.newParentDialog = false;
    storeGraph.showAddExistingSubSystemDialog = false;
    storeGraph.subSystemHistoryDialog = false;
}
</script>

<style>

.top-section {
    display: flex;
    flex-direction: row;
    width: 100%;
    overflow: hidden;
    justify-content: space-around;
}
.graph-right {
    height: 100%;
    width: 100%;
    overflow: hidden;
    border-left: 1px solid;
}
.tooltip-wrapper {
    height: 100%;
    position: relative;
}
.right {
  height: 100%;
}
.content {
    height: 100%;
}
.graph {
    height: 100%;
}
.graph_home {
    display: flex;
    flex-direction: row;
    height: 94vh;
    width: 100vw;
}
.edit_input {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.toolbar {
    width: 100%;
    background-color: rgb(255, 255, 255);
    height: 56px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #C4C4C4;
}
.toolbar_nodes_label {
    color: black;
}
.toolbar_edges {
    display: flex;
    float: right;
    flex-wrap: nowrap;
}
.toolbar_nodes {
    display: flex;
    float: right;
    flex-wrap: nowrap;
}
.toolbar_systems {
    display: flex;
    float: right;
    flex-wrap: nowrap;
}
.toolbar__left__title {
    margin-left: 10px;
}
.toolbar_systems {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin-left: 30px;
    float: right;
    justify-content: left;
}
.toolbar_btn {
    height: 28px;
    text-align: center;
    font-size: 11px;
    padding: 7px 7px ;
    background-color: #5557288b;
    color: #fff;
    border-radius: 5px;
    border: none;
    margin-left: 10px;
}
.toolbar_btn:hover {
    cursor: pointer;
    background-color: rgba(133, 136, 64, 0.532);
}
.toolbar_btn:disabled {
    border-radius: 5px;
    background-color: rgb(193, 193, 193);
    color: rgb(87, 87, 87);
    border: 1px solid rgb(0, 0, 0);
    cursor: not-allowed;
    text-align: center;
    font-size: 11px;
    padding: 7px 7px;
    border: none;
}
.tooltip {
    top: 0;
    left: 0;
    opacity: 1;
    position: absolute;
    width: auto;
    height: auto;
    /* padding: 10px; */
    padding-bottom: 10px;
    text-align: left;
    align-content: center;
    font-size: 12px;
    font-weight: 400;
    background-color: #b7b894;
    border-radius: 20px;
    /* box-shadow: 2px 2px 2px #aaa; */
    transition: opacity 0.2s linear;
    pointer-events: none;
}
.tooltip-info {
    width: fit-content;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
}

.toolbar v-field__input {
    margin-bottom: -2px;
    justify-content: center;
    margin-left: 20px;
    width: 100%;
}


.v-color-picker-edit__input {
    margin-left: 45px;
    width: 100%;
}
@media screen and (max-width: 1410px) and (min-width: 600px) {
    .toolbar_btn {
    
    text-align: center;
    font-size: 9px;
    padding: 2px 2px ;
    background-color: #5557288b;
    color: #fff;
    border-radius: 5px;
    border: none;
    margin-left: 5px;
}

.v-label{
    font-size: 13px;
    margin-left: -15px;
}

}

</style>