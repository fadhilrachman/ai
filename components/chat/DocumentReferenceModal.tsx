"use client";

import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  Popconfirm,
  Empty,
  Upload,
  message as antMessage,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  FileTextOutlined,
  SearchOutlined,
  UploadOutlined,
  PaperClipOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import chatApi from "@/lib/chatApi";

export interface DocumentReference {
  id: string | number;
  title: string;
  source_filename?: string;
  mime_type?: string;
  created_at: string;
}

interface DocumentReferenceModalProps {
  open: boolean;
  onClose: () => void;
}

const DocumentReferenceModal: React.FC<DocumentReferenceModalProps> = ({
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | number | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentReference | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch Documents
  const { data: documentsData, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await chatApi.get("/documents/");
      return response.data; // { count: number, documents: [] }
    },
    enabled: open, 
  });

  const documents: DocumentReference[] = documentsData?.documents || [];

  // Fetch Document Detail
  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["documentDetail", selectedDocId],
    queryFn: async () => {
      const response = await chatApi.get(`/documents/${selectedDocId}/`);
      return response.data;
    },
    enabled: !!selectedDocId && isDetailModalOpen,
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (values: any) => {
      const formData = new FormData();
      // Ant Design Upload wraps the raw file in an object. 
      // We need 'originFileObj' which is the actual File instance.
      if (values.file && values.file[0]) {
        const fileObj = values.file[0].originFileObj || values.file[0];
        formData.append("file", fileObj);
      }
      
      if (values.title) {
        formData.append("title", values.title);
      }
      
      const response = await chatApi.post("/documents/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      antMessage.success("Document uploaded successfully");
      setIsAddModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: any) => {
      console.error("Upload Error:", error);
      const errorData = error.response?.data;
      let errorMsg = "Failed to upload document";
      
      if (errorData) {
        if (typeof errorData === 'string') errorMsg = errorData;
        else if (errorData.error) errorMsg = errorData.error;
        else if (errorData.message) errorMsg = errorData.message;
        else if (typeof errorData === 'object') {
           errorMsg = Object.values(errorData).flat().join(" | ");
        }
      }
      antMessage.error(errorMsg || "Upload failed");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await chatApi.delete(`/documents/${id}/`);
    },
    onSuccess: () => {
      antMessage.success("Document deleted");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: any) => {
      console.error("Delete Error:", error);
      antMessage.error("Failed to delete document");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string | number; title: string }) => {
      // Assuming PATCH exists as per request for "update" feature
      const response = await chatApi.patch(`/documents/${id}/`, { title });
      return response.data;
    },
    onSuccess: () => {
      antMessage.success("Document updated successfully");
      setIsEditModalOpen(false);
      setEditingDoc(null);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: any) => {
      console.error("Update Error:", error);
      antMessage.error(error.response?.data?.error || "Failed to update document");
    },
  });

  const handleAdd = () => {
    form.resetFields();
    setIsAddModalOpen(true);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleViewDetail = (id: string | number) => {
    setSelectedDocId(id);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (doc: DocumentReference) => {
    setEditingDoc(doc);
    editForm.setFieldsValue({ title: doc.title });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    editForm.validateFields().then((values) => {
      if (editingDoc) {
        updateMutation.mutate({ id: editingDoc.id, title: values.title });
      }
    });
  };

  const handleUpload = () => {
    form.validateFields()
      .then((values) => {
        // 'values.file' is already the fileList array thanks to normFile
        uploadMutation.mutate(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <span className="text-[#ECECF1]">Document References</span>
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width={600}
        className="document-modal"
      >
        <div className="flex flex-col gap-6 mt-4">
          <div className="flex items-center justify-between gap-4">
            <Input
              prefix={<SearchOutlined className="text-[#8E8EA0]" />}
              placeholder="Search documents..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-xs"
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="!bg-[#10A37F] hover:!bg-[#1ABC9C] !border-none"
            >
              Add Document
            </Button>
          </div>

          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
                <div className="text-[#8E8EA0] text-center py-4">Loading documents...</div>
            ) : filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="
                    group flex items-center justify-between p-4
                    bg-[#40414F] hover:bg-[#4E4F60]
                    border border-[#565869] rounded-xl
                    transition-all duration-200
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#565869]/50 flex items-center justify-center flex-shrink-0">
                      <FileTextOutlined className="text-xl text-[#10A37F]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#ECECF1] font-medium text-base">
                        {doc.title}
                      </span>
                      <span className="text-[#8E8EA0] text-xs flex items-center gap-1">
                        <PaperClipOutlined />
                        {doc.source_filename || "document"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetail(doc.id)}
                      className="!text-[#ACACBE] hover:!text-[#10A37F] hover:!bg-[#10A37F]/10"
                    />
                    {/* <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(doc)}
                      className="!text-[#ACACBE] hover:!text-[#3b82f6] hover:!bg-[#3b82f6]/10"
                    /> */}
                    <Popconfirm
                      title="Delete document"
                      description="Are you sure you want to delete this document?"
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
                      onConfirm={() => deleteMutation.mutate(doc.id)}
                    >
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        className="!text-[#ACACBE] hover:!text-[#EF4444] hover:!bg-[#EF4444]/10"
                      />
                    </Popconfirm>
                  </div>
                </div>
              ))
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-[#8E8EA0]">
                    {searchText
                      ? "No documents found"
                      : "No documents yet. Add your first document!"}
                  </span>
                }
              />
            )}
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <span className="text-[#ECECF1] text-lg">
             Add Document
          </span>
        }
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        width={500}
        okText="Upload Document"
        onOk={handleUpload}
        confirmLoading={uploadMutation.isPending}
        okButtonProps={{
          className: "!bg-[#10A37F] hover:!bg-[#1ABC9C] !border-none",
        }}
        cancelButtonProps={{
          className: "hover:!text-[#ECECF1] hover:!border-[#ECECF1]",
        }}
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item
            name="title"
            label={<span className="text-[#ECECF1]">Document Title</span>}
          >
            <Input 
              placeholder="e.g. Q1 Financial Report (optional)" 
              className="!bg-[#343541] !border-[#565869] !text-[#ECECF1] placeholder:!text-[#8E8EA0]" 
            />
          </Form.Item>

          <Form.Item
            name="file"
            label={<span className="text-[#ECECF1]">File Upload</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload a file" }]}
          >
            <Upload.Dragger
              maxCount={1}
              beforeUpload={() => false}
              className="!bg-[#343541] !border-[#565869] hover:!border-[#10A37F] group"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined className="!text-[#10A37F] text-3xl group-hover:scale-110 transition-transform" />
              </p>
              <p className="ant-upload-text !text-[#ECECF1]">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint !text-[#8E8EA0]">
                Support for PDF, DOCX, and TXT files
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={<span className="text-[#ECECF1]">{detailData?.title || "Document Detail"}</span>}
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setSelectedDocId(null);
        }}
        footer={null}
        width={700}
      >
        <div className="mt-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
          {isDetailLoading ? (
            <div className="text-[#8E8EA0] text-center py-10">Extracting content...</div>
          ) : detailData?.content ? (
            <div className="text-[#ECECF1] whitespace-pre-wrap font-sans leading-relaxed bg-[#343541] p-6 rounded-xl border border-[#565869]">
              {detailData.content}
            </div>
          ) : (
            <Empty description={<span className="text-[#8E8EA0]">No content available</span>} />
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={<span className="text-[#ECECF1]">Rename Document</span>}
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingDoc(null);
        }}
        onOk={handleUpdate}
        confirmLoading={updateMutation.isPending}
        okText="Save Changes"
        okButtonProps={{ className: "!bg-[#10A37F] hover:!bg-[#1ABC9C] !border-none" }}
      >
        <Form form={editForm} layout="vertical" className="mt-6">
          <Form.Item
            name="title"
            label={<span className="text-[#ECECF1]">New Title</span>}
            rules={[{ required: true, message: "Please input document title" }]}
          >
            <Input 
              placeholder="Enter new title" 
              className="!bg-[#343541] !border-[#565869] !text-[#ECECF1]" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DocumentReferenceModal;
