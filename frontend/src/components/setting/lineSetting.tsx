import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import SnackBer from "../snackBer";
import { useFindLineSetting } from "../../feature/hooks/useFindLineSetting";
import { useLineNotification } from "../../feature/hooks/useNotificationLine";
import { useSaveLineSetting } from "../../feature/hooks/useSaveLineSetting";
import Loading from "../loading";
import {
  isLineSettingSaveStatus,
  isNotificationStatus,
  LINE_NOTIFICATION_MESSAGES,
  LINE_SETTING_SAVE_MESSAGES,
  SYSTEM_ERROR,
} from "../../feature/lineSetting/lineNotificationMessages";

interface LineFormData {
  id?: number;
  channelAccessToken: string;
  userId: string;
}

function LineSetting() {
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LineFormData>({
    defaultValues: {
      channelAccessToken: "",
      userId: "",
    },
  });

  const { lineSetting, isLineSettingFindError, isLineSettingFindLoading } =
    useFindLineSetting();
  const { sendNotification, notificationSendStatus } = useLineNotification();
  const { saveLineSettings, lineSettingSaveStatus } = useSaveLineSetting();

  const onSubmit = (form: LineFormData) => {
    saveLineSettings(form);
  };

  const notificationLine = () => {
    sendNotification("通知テスト");
  };

  useEffect(() => {
    if (lineSetting) reset(lineSetting);
  }, [lineSetting, reset]);

  useEffect(() => {
    if (isLineSettingSaveStatus(lineSettingSaveStatus)) {
      setSnackBarMessage(LINE_SETTING_SAVE_MESSAGES[lineSettingSaveStatus]);
      return;
    }
    if (
      notificationSendStatus &&
      isNotificationStatus(notificationSendStatus)
    ) {
      setSnackBarMessage(LINE_NOTIFICATION_MESSAGES[notificationSendStatus]);
      return;
    }
    if (isLineSettingFindError) {
      setSnackBarMessage(SYSTEM_ERROR);
    }
  }, [lineSettingSaveStatus, notificationSendStatus, isLineSettingFindError]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        LINE設定
      </Typography>

      {isLineSettingFindLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="channelAccessToken"
            control={control}
            rules={{ required: "入力必須項目です" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="LINEトークン"
                type="password"
                error={!!errors.channelAccessToken}
                helperText={errors.channelAccessToken?.message}
              />
            )}
          />

          <Controller
            name="userId"
            control={control}
            rules={{ required: "入力必須項目です" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="LINEユーザーID"
                type="password"
                error={!!errors.userId}
                helperText={errors.userId?.message}
              />
            )}
          />

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" type="submit">
              保存
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSubmit(() => notificationLine())}
            >
              通知テスト
            </Button>
          </Box>
        </form>
      )}

      {snackBarMessage && <SnackBer message={snackBarMessage} />}
    </Container>
  );
}

export default LineSetting;
