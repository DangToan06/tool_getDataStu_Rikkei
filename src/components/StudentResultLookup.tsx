import { useState, type JSX } from "react";
import {
  Button,
  Input,
  Card,
  Alert,
  Spin,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface StudentResult {
  courseId?: number;
  finalResult?: {
    quizzi?: number;
    project?: number;
    interview_point?: number;
    finalScore?: number;
    [key: string]: unknown;
  };
  resultTest?: Array<{
    link?: string | null;
    point?: number;
    testSchedule?: {
      test?: {
        testName?: string;
        type?: string;
      };
    };
  }>;
  [key: string]: unknown;
}

export default function StudentResultLookup(): JSX.Element {
  const [idStudent, setIdStudent] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("54");
  const [result, setResult] = useState<StudentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token: string =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpbmh0cm9uZ2FuMjAwNkBnbWFpbC5jb20iLCJpZCI6MTAzLCJmdWxsTmFtZSI6IsSQaW5oIFRy4buNbmcgQW4iLCJhdmF0YXIiOiJodHRwOi8vcmVzLmNsb3VkaW5hcnkuY29tL2R6ZzJ1MjNpeS9pbWFnZS91cGxvYWQvdjE3NTAwODEyMjIvYXFucHo2dm15aTN2dXp2dGtkeXouanBnIiwic3R1ZGVudENvZGUiOiJQVElULUhOLTAzNyIsImRvYiI6IjIwMDYtMTItMjUiLCJwaG9uZSI6IjAzNDM1ODAzODkiLCJyb2xlIjoic3R1ZGVudCIsInN5c3RlbUlkIjo4LCJ0eXBlIjoic3R1ZGVudCIsImlhdCI6MTc2MDcxMDExMSwiZXhwIjoxNzYwNzk2NTExfQ.3Ofrk2F9H9k0mWJtZYyEVwEsoeJjHaQcIAWwTv8AwG4";

  const handleSubmit = async (): Promise<void> => {
    if (!idStudent) {
      setError("Vui lòng nhập ID học sinh");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `https://apiportal.rikkei.edu.vn/students/resultByCourse/${idStudent}/${courseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StudentResult = await response.json();
      setResult(data.resultData);
    } catch (err) {
      setError((err as Error).message || "Không thể kết nối đến API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* FORM TRA CỨU */}
        <Card
          style={{
            marginBottom: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title level={2} style={{ marginBottom: "8px" }}>
                Tra Cứu Kết Quả Học Sinh
              </Title>
              <Text type="secondary">
                Nhập ID học sinh để xem kết quả khóa học
              </Text>
            </div>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong>ID Học Sinh</Text>
                  <Input
                    type="number"
                    size="large"
                    value={idStudent}
                    onChange={(e) => setIdStudent(e.target.value)}
                    placeholder="Nhập ID học sinh..."
                    onPressEnter={handleSubmit}
                  />
                </Space>
              </Col>

              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong>ID Khóa Học</Text>
                  <Input
                    type="number"
                    size="large"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    disabled
                  />
                </Space>
              </Col>
            </Row>

            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSubmit}
              loading={loading}
              block
              style={{ height: "48px", fontSize: "16px" }}
            >
              {loading ? "Đang tải..." : "Tra Cứu"}
            </Button>
          </Space>
        </Card>

        {/* HIỂN THỊ LỖI */}
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: "24px", borderRadius: "8px" }}
          />
        )}

        {/* LOADING */}
        {loading && (
          <Card style={{ textAlign: "center", borderRadius: "12px" }}>
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </Card>
        )}

        {/* KẾT QUẢ */}
        {result && !loading && (
          <Card
            title={
              <Space>
                <CheckCircleOutlined
                  style={{ color: "#52c41a", fontSize: "20px" }}
                />
                <Text strong style={{ fontSize: "18px" }}>
                  Kết Quả
                </Text>
              </Space>
            }
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {/* Bảng điểm */}
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              {result.finalResult ? (
                <>
                  <Title
                    level={4}
                    style={{ marginBottom: "16px", textAlign: "center" }}
                  >
                    🎓 Kết quả khóa học
                  </Title>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      maxWidth: "500px",
                      margin: "0 auto",
                    }}
                  >
                    {[
                      { label: "Quizzi", value: result.finalResult.quizzi },
                      { label: "Project", value: result.finalResult.project },
                      {
                        label: "Interview",
                        value: result.finalResult.interview_point,
                      },
                      {
                        label: "Final Score",
                        value: result.finalResult.finalScore,
                      },
                    ].map((item) => (
                      <Card
                        key={item.label}
                        style={{
                          textAlign: "center",
                          borderRadius: "10px",
                          background: "#fff",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Text
                          type="secondary"
                          style={{ display: "block", fontSize: "14px" }}
                        >
                          {item.label}
                        </Text>
                        <Text
                          strong
                          style={{
                            fontSize: "20px",
                            color:
                              (item.value ?? 0) >= 90
                                ? "#16a34a"
                                : (item.value ?? 0) >= 70
                                ? "#eab308"
                                : "#dc2626",
                          }}
                        >
                          {item.value ?? "—"}
                        </Text>
                      </Card>
                    ))}
                  </div>

                  {/* Link Project nếu có */}
                  {result.resultTest?.some((t) => t.link) && (
                    <div style={{ marginTop: "24px", textAlign: "center" }}>
                      <Text strong style={{ fontSize: "16px" }}>
                        🔗 Link Project:
                      </Text>
                      <div style={{ marginTop: "8px" }}>
                        {result.resultTest
                          ?.filter((t) => t.link)
                          .map((t, idx) => (
                            <div key={idx}>
                              <a
                                href={t.link!}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#2563eb",
                                  fontWeight: 500,
                                  textDecoration: "none",
                                }}
                              >
                                <LinkOutlined /> {t.link}
                              </a>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Text type="secondary">Không có dữ liệu kết quả</Text>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
